import React, { useState } from 'react'
import './askGpt.css'

function AskGpt() {
    const url= process.env.REACT_APP_URL
    
    const [form,setForm]=useState({
        prompt:'',
        file:null
    })

    const [response,setResponse]=useState(null)
    const [generateResp,setGenerateResp]=useState(false)

    const handlePromptChange=(e)=>{
        setForm({...form,prompt:e.target.value})
    }

    const handleFileChange=(e)=>{
        setForm({...form,file:e.target.files[0]})
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
    }

    const handleClick = async () => {
        setGenerateResp(true)
        const text = await anonymizeFile()
        try{
        const res = await fetch(`${url}/ask`,{
        method:"POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({"question":form.prompt,"text":text})
        })
        const data = await res.json()
        console.log(data['response'])
        setResponse(data['response'])
        setGenerateResp(false)
        } catch(err){
        console.log(`error while sending request to ask endpoint ${err.message}`)
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

    return (
    <div className='askGpt-wrapper'>
        <form className='ask-form' onSubmit={handleSubmit}>
            <div className='form-field-file'>
                <label htmlFor='file' > Share Your Legal Document </label>
                <input type="file" id='file' onChange={handleFileChange}/>
            </div>
            { response && !generateResp?
            <div>
                <h4> Answer : </h4>
                <div className="response-text">{response}</div>
            </div>:null
            }
        
            {generateResp && 
                <div><p>Loading The Answer...</p></div>
            }
            <div className='form-field'>
                <label htmlFor='prompt'> Your Question </label>
                <textarea id='prompt' placeholder='Enter Your Question' value={form.prompt} onChange={handlePromptChange} />
                <button type='submit' onClick={handleClick}>Send</button>
            </div>
        </form>

    </div>
    
    )
}

export default AskGpt
