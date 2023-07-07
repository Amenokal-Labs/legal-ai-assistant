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

    const handleSubmit=(e)=>{
        e.preventDefault()
    }

    const handleClick = async () => {
        if(validate()){
            setGenerateResp(true)
            const prompt = form.prompt
            const text = await anonymizeFile()
            try{
            setForm({...form,prompt:''})
            textareaRef.current.style.height = '25px'
            const res = await fetch(`${url}/ask`,{
            method:"POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"question":prompt,"text":text})
            })

            const data = await res.json()
            console.log(data['response'])
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
            </div>
        </form>

    </div>
    
    )
}

export default AskGpt
