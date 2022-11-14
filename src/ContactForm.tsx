import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import './App.css';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

//create html form inputs and pass them to the form submission function to send to axios via post call
//need state to handle form elements

type contactFormState = {
  firstName: string;
  surName: string;
  email: string;
  message: string;
}

type submittedMessage = {
  class: string;
  text: string;
}


const ContactForm = () => {
 
  const initFormState = {
    firstName: '',
    surName: '',
    email: '',
    message: '',
  }

  const [contactFormState, setcontactFormState] = useState<contactFormState>(initFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [endUserMessage, setendUserMessage] = useState<submittedMessage>();

  //for recaptchaR so can reset element on the page
  const [recaptchaToken, setReCaptchaToken] = useState<string>();
  const recaptchaKey = '6LdfKwQjAAAAALrilPQxHxetUf1YPqEhNUxR27L-';
  const recaptchaRef = useRef<any>();
 

  const updateRecaptchaToken = (token: string | null) => {
    setReCaptchaToken(token as string);
  };

  const updateFormControl = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //need to update state of form its imutible so need to create a copy and update revelant copy thats changed
    const {id, value} = event.target;
    //typescript happy we are accessing the key of contactFormState
    const formKey = id as keyof contactFormState;
    //shallow copy of original state
    const updatedFormState = { ...contactFormState}
    //formkey is id we set below inside each input
    updatedFormState[formKey] = value;
    console.log('v',value)
    setcontactFormState(updatedFormState)
  }


  const formid = 'e0yFBXHF';
  const formSparkURLcontactForm = `https://submit-form.com/${formid}`;

  const submitContactForm = async(event: FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      await postSubmission();
      setSubmitting(false);
  }
  //submit form process in it's own seperate function
  const postSubmission = async() => {
    const payload = {
      ...contactFormState,
      "g-recaptcha-response": recaptchaToken,
    }
    try{
      const result = await axios.post(formSparkURLcontactForm, payload)
      console.log(result);
      setendUserMessage({
        class: "submitmessage",
        text: "Thanks, someone will be in touch shortly.",
      });
      recaptchaRef.current.reset();
      setcontactFormState(initFormState);
      setTimeout( () => setendUserMessage({ class: "",
      text: ""}), 4000);
    }catch(error){
      console.log(error);
      setendUserMessage({
        class: "submitmessage",
        text: "Sorry, there was a problem. Please try again or contact support.",
      });
    }

  } 
  return (
    <div className="App">
      <header className="App-header">
        <h1>Contact us</h1>
        {endUserMessage && (
          <div className={`${endUserMessage.class}`}>
            {endUserMessage.text}
          </div>
        )}
       <p></p>
        <form onSubmit={submitContactForm}>
          <div>
            <label htmlFor="firstName">Enter First Name </label>
            <input id="firstName" type="text" value={contactFormState.firstName} onChange={updateFormControl} placeholder='Enter First Name'/>
          </div>
          <div>
            <label htmlFor="surName">Enter Surname </label>
            <input id="surName" type="text" value={contactFormState.surName} onChange={updateFormControl} placeholder='Enter Surname'/>
          </div>
          <div>
            <label htmlFor="email">Enter Email </label>
            <input id="email" type="text" value={contactFormState.email} onChange={updateFormControl} placeholder='Enter Email'/>
          </div>
          <p></p>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaKey}
            onChange={updateRecaptchaToken}
          />

          <button disabled={submitting}>{submitting ? "submitting..." : "submit"}</button>

        </form>
    
      </header>
     
    </div>
  );
}

export default ContactForm;
