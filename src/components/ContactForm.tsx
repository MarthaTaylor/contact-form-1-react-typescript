import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import '../App.css';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

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
  const [recaptchaToken, setReCaptchaToken] = useState<string>();

  const recaptchaKey = '6LdfKwQjAAAAALrilPQxHxetUf1YPqEhNUxR27L-';
  const recaptchaRef = useRef<any>();
 
  const updateRecaptchaToken = (token: string | null) => {
    setReCaptchaToken(token as string);
  };

  const updateFormControl = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {id, value} = event.target;
    const formKey = id as keyof contactFormState;
    const updatedFormState = { ...contactFormState}
    updatedFormState[formKey] = value;
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

  const postSubmission = async() => {
    const payload = {
      ...contactFormState,
      "g-recaptcha-response": recaptchaToken,
    }
    try{
      const result = await axios.post(formSparkURLcontactForm, payload)
      setendUserMessage({
        class: "submitmessage",
        text: "Thanks, someone will be in touch shortly.",
      });
      recaptchaRef.current.reset();
      setcontactFormState(initFormState);
      setTimeout( () => setendUserMessage({ class: "",
      text: ""}), 2000);
    }catch(error){
      setendUserMessage({
        class: "submitmessage",
        text: "Sorry, there was a problem. Please try again or contact support.",
      });
    }
  } 
  
  return (
    <div className="contactform">
     
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
     
    </div>
  );
}

export default ContactForm;
