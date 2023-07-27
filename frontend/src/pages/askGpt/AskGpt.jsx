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
    const [response,setResponse]=useState('')
    const [generateResp,setGenerateResp]=useState(false)


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
    const handleStream = ()=>{
        const evtSource = new EventSource(`${url}stream/askstream`);
        evtSource.addEventListener("new_message", function (event) {
            // Logic to handle status updates
            setResponse(prevResponse => prevResponse + event.data);
            console.log(event.data)
          });
      
          evtSource.addEventListener("end_event", function (event) {
            console.log(event.data)
            evtSource.close();
            setGenerateResp(false)
          });
      }

    const handleClick = async () => {
        if(validate()){
            setGenerateResp(true)
            const prompt = []
            prompt.push(form.prompt)
            for(const q of otherQuestions){
                prompt.push(q.question)
            }
            const text = await anonymizeFile()
            try{
            setForm({...form,prompt:''})
            textareaRef.current.style.height = '25px'
            setQuestions([])
            const res = await fetch(`${url}stream/ask`,{
            method:"POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"questions":prompt,"text":text})
            })
            console.log(res)
            
            // Handle the SSE data using EventSource
            handleStream()
            
            } catch(err){
            console.log(`error while sending request to ask endpoint ${err.message}`)
            }
        }
    }

    const anonymizeFile = async () =>{
        const formData=new FormData()
        formData.append('file',form.file)
        try{
        const res = await fetch(`${url}anonymize`,{
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
                        <div>{response}</div>
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
