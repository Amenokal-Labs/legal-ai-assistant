import React, { useState, useRef } from 'react'
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
    const [generateResp,setGenerateResp]=useState(false)

    const handlePromptChange=(e)=>{
        setForm({...form,prompt:e.target.value})
    }

    const handleTextAreaResize = (e) => {
        const textarea = textareaRef.current
        textarea.style.height = '25px'
        if(textarea.scrollHeight <= '70px'){
            textarea.style.height = `${textarea.scrollHeight}px`
        } else {
            textarea.style.height='70px'
            textarea.style.setProperty('-webkit-scrollbar-width', '5px');
        }
    };

    const handleFileChange=(e)=>{
        setForm({...form,file:e.target.files[0]})
    }

    const handleAddQuestion = (e) => {
        const updatedQuestions = [...otherQuestions, { question: '' }];
        setQuestions(updatedQuestions);
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
            const res = await fetch(`${url}/ask`,{
            method:"POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"questions":prompt,"text":text})
            })

            const data = await res.json()
            console.log(data['response'])
            console.log(data)
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
        if (form.prompt && form.file) return true
        else return false
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
                        <p>{response}</p>
                    </ReactScrollableFeed>
                </div> :null
                
            }   
            
        
            {generateResp && 
                <div className='loading-text'><p>Loading The Answer...</p></div>
            }
            <div className='form-text-field'>
                <label htmlFor='prompt'> Your Question </label>
                <textarea id='prompt' ref={textareaRef} placeholder='Type Your Question' value={form.prompt} onChange={handlePromptChange} onKeyUp={handleTextAreaResize} required />
                <button type='submit' onClick={handleClick}>Send</button>
                <button type='button' onClick={handleAddQuestion}>+</button>
                {otherQuestions.length>0 &&
                <button type='button' onClick={handleRemoveQuestion}>-</button>
                }
                
            </div>
            {otherQuestions.map((q,index)=>{
                return <div key={index}><input type='text' value={q.question} name={`q${index}`}  placeholder={`Type Your Question ${index + 2}`} onChange={(e)=> handleQuestionChange(e.target.value,index)} /></div>
            })}
        </form>

    </div>
    
    )
}

export default AskGpt
