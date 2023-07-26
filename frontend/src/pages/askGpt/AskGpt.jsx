import React, { useState, useRef, useEffect } from 'react'
import ReactScrollableFeed from 'react-scrollable-feed'
import './askGpt.css'


function AskGpt() {
    const url= process.env.REACT_APP_URL
    const textareaRef = useRef(null);
    
    const [form,setForm]=useState({
        prompt:'',
        file:null
    })

    const [otherQuestions,setQuestions]= useState([])
    const [response,setResponse]=useState(null)
    const [formattedResponse,setFormattedResponse]=useState('')
    const [generateResp,setGenerateResp]=useState(false)

    useEffect(()=>{
        if (response != null){
        // Extract question-answer pairs
        const questionAnswers = response.split('\n\n');
        // Format the questions and answers for display
        const formattedText = questionAnswers.map((qa, index) => (
            <div key={index}>
            <strong>Question {index + 1}:</strong> {qa.replace(`Question ${index + 1}: `, ' ')}
            </div>
        ));
        // Set the formatted response for rendering
        setFormattedResponse(formattedText);}
    },[response])

    
    const handlePromptChange=(e)=>{
        setForm({...form,prompt:e.target.value})
        handleTextAreaResize()
       
    }

    const handleTextAreaResize = () => {
        const textarea = textareaRef.current;
        const computedStyle = window.getComputedStyle(textarea);
        const paddingTop = parseInt(computedStyle.paddingTop);
        const paddingBottom = parseInt(computedStyle.paddingBottom);
        const totalPadding = paddingTop + paddingBottom;
    
        textarea.style.height = '25px';
        textarea.style.overflowY = 'hidden'; // To hide vertical scrollbar while resizing
    
        const currentScrollHeight = textarea.scrollHeight - totalPadding;
        const contentHeight = Math.max(currentScrollHeight, 25);
    
        textarea.style.height = `${contentHeight}px`;
      };
    
      useEffect(() => {
        handleTextAreaResize(); // Initial resize when the component mounts
      }, []);
    
    
    
      
  
    const handleFileChange=(e)=>{
        setForm({...form,file:e.target.files[0]})
    }

    const handleAddQuestion = (e) => {
        if(otherQuestions.length<=8){
        const updatedQuestions = [...otherQuestions, { question: '' }];
        setQuestions(updatedQuestions);}
    };

    const handleRemoveQuestion = (e) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = prevQuestions.slice(0, prevQuestions.length - 1); 
            return updatedQuestions; 
        });
    };
    

    const handleQuestionChange = (value,index) => {
        setQuestions((prevQuestions)=>{
            const updatedQuestions = prevQuestions.map((q,i)=>{
                if(i===index){
                    return {...q,question:value}
                }
                return q;
            })
            return updatedQuestions
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
    }

    const handleClick = async () => {
        if(validate()){
            setGenerateResp(true)
            const prompt = []
            prompt.push(form.prompt)
            for(const q of otherQuestions){
                prompt.push(q.question)
            }
            console.log(prompt)
            const text = await anonymizeFile()
            try{
            setForm({...form,prompt:''})
            textareaRef.current.style.height = '25px'
            setQuestions([])
            const res = await fetch(`${url}/ask`,{
            method:"POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"questions":prompt,"text":text})
            })

            const data = await res.json()
            setResponse(data['response'])
            setGenerateResp(false)
            } catch(err){
            console.log(`error while sending request to ask endpoint ${err.message}`)
            }
        }
    }

    const anonymizeFile = async () =>{
        const formData=new FormData()
        formData.append('file',form.file)
        try{
        const res = await fetch(`${url}/anonymize`,{
        method:'POST',
        body:formData,
        })
        const data = await res.json()
        return data['anonymized-content']
        }
        catch(err){
        console.log(`error at anonymizing the file ${err.message}`)
        }
    }

    const validate = () => {
        if (!form.prompt || !form.file) return false
        return(otherQuestions.every((q) => q.question.length !== 0))
    }

    return (
    <div className='askGpt-wrapper'>
        <form className='ask-form' onSubmit={handleSubmit}>
            <div className='form-field-file'>
                <label htmlFor='file' > Share Your Legal Document </label>
                <input type="file" id='file' onChange={handleFileChange} required/>
            </div>
            { response && !generateResp?

                <div className="response-text">
                    <ReactScrollableFeed>
                        <h4> Answer : </h4>
                        <div>{formattedResponse}</div>
                    </ReactScrollableFeed>
                </div> :null
                
            }   
            
        
            {generateResp && 
                <div className='loading-text'><p>Loading The Answer...</p></div>
            }
            <div className='form-text-field'>
                <label htmlFor='prompt'> Your Question </label>
                <textarea id='prompt' ref={textareaRef} 
                placeholder='Type Your Question' 
                value={form.prompt} 
                onChange={handlePromptChange}
                onInput={handleTextAreaResize}
                onKeyUp={handleTextAreaResize} // To handle resizing after deleting content
                required />
                <button type='submit' onClick={handleClick}>Send</button>
                <div className='question-buttons'>
                    {otherQuestions.length <=
                     0 &&
                    <button type='button' onClick={handleAddQuestion}>+</button>
                    }
                </div>
            </div>
                {otherQuestions.map((q,index)=>{
                    return (
                    
                    <div className='other-questions-wrapper'>
                        <div style={{display:'flex',gap:'0px',justifyContent:'space-around'}}>
                            <div id='other-questions'>
                                <div key={index}><input id='other-questions-input' type='text' value={q.question} name={`q${index}`}  placeholder={`Type Your Question ${index + 2}`} onChange={(e)=> handleQuestionChange(e.target.value,index)} required /></div>
                            </div>
                                {index === 0 ?
                                    <div className='question-buttons'>
                                    <button type='button' onClick={handleAddQuestion}>+</button>
                                    <button type='button' onClick={handleRemoveQuestion}>-</button>
                                    </div>
                            :  <div className='question-buttons'>
                                <button type='button' onClick={handleAddQuestion} style={{opacity:0, pointerEvents: 'none'}}>+</button>
                                <button type='button' onClick={handleRemoveQuestion} style={{opacity:0, pointerEvents: 'none'}}>-</button>
                            </div>
                            }
                        </div>
                        
                    </div>
                    )
                })}
        </form>

    </div>
    
    )
}

export default AskGpt
