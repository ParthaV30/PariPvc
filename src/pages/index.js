import React, { useEffect, useState, useRef  } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
ReactSession.setStoreType("localStorage");

const App = () => {

    const initialvalue={email: '', password:''};
    const [formvalue, setvalue]=useState(initialvalue);
    const [formError, setError]=useState({});
    const [formsubmit, setsubmit]=useState(false);

    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('email');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(false);

    const [formvalues, setvalues]=useState('');
    const [formemail, setformemail]=useState('');
    const [formotp, setformotp]=useState('');

    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passworderror, setpassworderror]=useState('');
    const [passwordShow, setPasswordShow] = useState(true);

    const formRef = useRef();
    const [shouldSubmit, setShouldSubmit] = useState(false);
  
    const togglePasswordVisibility = () => {
      setPasswordShow(prev => !prev);
    };
    
    

    const navigate = useNavigate();

    const fetchDatalog = async () => {
     
      const userId = ReactSession.get("upvcuserId");
     const companyname= ReactSession.get("companyname");

           
      try {
        const response = await axios.post(`http://localhost/projects/upvc/api_log/log/`, {formvalue, userId, companyname});
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    
    if(!ReactSession.get("upvcuserId")){
      ReactSession.set("upvcuserId","0");
    }
    else{
      ReactSession.set("upvcuserId", ReactSession.get("upvcuserId"));
    }
    
    const handleChange = (e) => {
      const { name, value } = e.target;
          setvalue({...formvalue, [name]: value});
    };
  
    const handleSubmit = async (e) => {
     
      e.preventDefault();
      setsubmit(true);
      setError({});

  
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/user/', formvalue);
      //  console.log(response.data);
        if(response.data.status === 'success' ){
          ReactSession.set("upvcuserId", response.data.data.user_id);
          ReactSession.set("upvcAddress", response.data.data.user_address);
          ReactSession.set("upvcNumber", response.data.data.user_mobile);
          ReactSession.set("upvcImage", response.data.data.user_image);
          ReactSession.set("upvcuserName", response.data.data.user_name);
          ReactSession.set("upvcuserType", response.data.data.user_type);
          ReactSession.set("upvcuserQuotes", response.data.data.user_quotes);
          ReactSession.set("upvcuserEngineers", response.data.data.user_engineers);
          ReactSession.set("upvcuserClients", response.data.data.user_clients);
          ReactSession.set("upvcuserProfiles", response.data.data.user_profiles);
          ReactSession.set("upvcemail", response.data.data.user_email);
          ReactSession.set("upvcregid", response.data.data.user_regId );
          ReactSession.set("upvclimit", response.data.data.user_limit );
          ReactSession.set("upvcsubUsers", response.data.data.user_sub );
          ReactSession.set("companyname", localStorage.getItem("businessName") || "Pari and Co" );
          ReactSession.set("upvcreport", false);
          fetchDatalog();
        

          if(response.data.data.employer_id){
            ReactSession.set("upvcempid", response.data.data.employer_id );
          }
          if(response.data.data.user_type === '1'){
          navigate('/dashboard');
          }
          if(response.data.data.user_type === '2'){
          navigate('/dashboard');
          }
          if(response.data.data.user_type === '3'){
          navigate('/dashboard');
          }
          
        }else{
         // console.log(response.data.error.message);
          ReactSession.set("upvcuserId", "0");
        }
  
        setError(validate(response));
        
        } catch (error) {
        //  console.error('Login failed!', error);
          ReactSession.set("upvcuserId", "0");
        }
  
      
    };
    
    const validate=(response)=>{
      const errors={};
        if(response.data.error){
          errors.name = response.data.error.message;
        }
        return errors;
    }
  
    useEffect(()=>{
      // console.log(formError);
      if(Object.keys(formError).length ===0 & formsubmit){
       // console.log(formvalue);
      }
    });
    
    const { id } = useParams();
  
    if(id == 'logout'){
      ReactSession.set("upvcuserId", "0");
    }

   


    const handleChangesemail = (e) => {
      const { name, value } = e.target;
      setformemail({...formemail, [name]: value});
    };

    const handleChanges = (e) => {
      const { name, value } = e.target;
          setvalues({...formvalues, [name]: value});
    };



    const handleChangesotp = (e) => {
      const { name, value } = e.target;
      setformotp({...formotp, [name]: value});
    };

    const handleforgetSubmit = async (e) => {
      e.preventDefault();
     
      if (formvalues.password1 != formvalues.password2) {
        console.error('Passwords do not match!');
        setpassworderror('Passwords do not match!');
      
        return; 
    }else{
      
      
      const formData={
        email:formemail.email,
        password:formvalues.password1,
      }
     // console.log(formData);
  
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/change-password/', formData);
       // console.log(response.data);
        if(response.data.status === 'success' ){
          setpassworderror('');
         setvalues('');
          setShowModal(false);
        }
        } catch (error) {
          console.error('Login failed!', error);
          setvalues('');
        }

    }

      
  
      
    };
    
    

   
    
    
    
    const handleEmail = async (e) => {
      e.preventDefault();
      
     
        const formData={
          email:formemail.email,
          
        }
        
  
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/forgot-password/', formData);
        //  console.log(response.data);
          if(response.data.status === 'success' ){
            setIsEmailValid(true);
            setEmailError('');
            setActiveTab('otp');

          }else{
        //    console.log(response.data.message);
            setIsEmailValid(false);
            setEmailError(response.data.message);
          }
          } catch (error) {
            console.error('Login failed!', error);
           
          }
      
      
    };


    const handleotp = async (e) => {
      e.preventDefault();

   
     
     
        const formData={
          email:formemail.email,
          otp:formotp.otp,
          
        }
      
  
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/check-otp/', formData);
         // console.log(response.data);
          if(response.data.status === 'success' ){
            setIsOtpValid(true);
            setOtpError('');
            setActiveTab('password');

          }else{
            setIsOtpValid(false);
            setOtpError(response.data.message);
          }
          } catch (error) {
            console.error('Login failed!', error);
           
          }
       
    };
    const closemodal=()=>{
      setShowModal(false);
    }

    const demoUser = () => {
      setvalue({['email']: 'demouser@saalaram.com', ['password']: '12345'});
      setShouldSubmit(true);
    };

    useEffect(() => {
      if (shouldSubmit) {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
        setShouldSubmit(false); // Reset
      }
    }, [formvalue, shouldSubmit]);


    return (

      

      <div class="auth-main">
        <div class="auth-wrapper v1">
          <div class="auth-form">
          <img 
            src="/assets/images/pari-logo.png" 
            alt="Pari and Co" 
            className="rounded-circle shadow-lg mb-3" 
            style={{ width: '110px', height: '110px', objectFit: 'cover', border: '3px solid #2563EB' }} 
          />
            <div class="card my-5">
              <div class="card-body">


            


              <div className={`modal fade custom-modal  ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="onloadModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog" style={{ width: '500px' }}>
          <div className="modal-content" align="center">
         
            <div className="mt-3 mb-3">
            <a style={{float:'right', fontWeight:'800px', fontSize:'large', transform: 'rotate(45deg)'}} onClick={closemodal}><i class="ti ti-plus"></i></a>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${activeTab === 'email' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('email')}
                        type="button"
                    >
                        Email
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${isEmailValid && activeTab === 'otp' ? 'active' : 'disabled'}`} 
                        onClick={() => isEmailValid && setActiveTab('otp')}
                        type="button"
                    >
                        OTP
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${isOtpValid && activeTab === 'password' ? 'active' : 'disabled'}`} 
                        onClick={() => isOtpValid && setActiveTab('password')}
                        type="button"
                    >
                        New Password
                    </button>
                </li>
            </ul>

              <div className="tab-content" id="myTabContent">
                {/* Email Form */}
                {activeTab === 'email' && (
                  <form onSubmit={handleEmail}>
                    <h4 className="text-center f-w-500 mb-3 mt-3">Password Change</h4>
                    <p className="text-center f-w-500 mb-3">Enter your Email ID registered with us.</p>
                    <div className="form-group mb-3">
                      <input type="email" className="form-control" placeholder="Enter your EmailID" name="email"  value={formemail.email} onChange={handleChangesemail} />
                    </div>
                    <div className="d-grid mt-4" style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                    <p style={{ color: 'red', textAlign: 'center', margin:'10px' }}>{emailError}</p>
                  </form>
                  )}
              
                {/* OTP Form */}
                {activeTab === 'otp' && (
                  <form onSubmit={handleotp}>
                    <h4 className="text-center f-w-500 mb-3 mt-3">Password Change</h4>
                    <p className="text-center f-w-500 mb-3">Enter OTP shared to your Email ID</p>
                    <div className="form-group mb-3">
                      <input type="number" className="form-control" placeholder="Enter your OTP" name="otp"  value={formotp.otp} onChange={handleChangesotp} />
                    </div>
                    <div className="d-grid mt-4" style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                      <p style={{ color: 'red', textAlign: 'center',margin:'10px' }}>{otpError}</p>
                    </div>
                  </form>
                )}


                

                {/* New Password Form */}
                {activeTab === 'password' && (
                  <form onSubmit={handleforgetSubmit}>
                    <h4 className="text-center f-w-500 mb-3 mt-3">Password Change</h4>
                    <div className="form-group mb-3">
                      <input type="password" className="form-control" placeholder="Enter your new password" name="password1" value={formvalues.password1} onChange={handleChanges} />
                    </div>
                    <div className="form-group mb-3">
                      <input type="password" className="form-control" placeholder="Re-Enter your new password" name="password2" value={formvalues.password2} onChange={handleChanges} />
                    </div>
                    <div className="d-grid mt-4" style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                      <p style={{ color: 'red', textAlign: 'center',margin:'10px' }}>{passworderror}</p>
                    </div>
                  </form>
                  )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
             
                <form onSubmit={handleSubmit} ref={formRef}>
                <h4 class="text-center f-w-500 mb-3">Login</h4>
                <div class="form-group mb-3">
                  <input type="email" class="form-control" placeholder="Email Address" name="email" value={formvalue.email} onChange={handleChange} />
                </div>
                <div class="form-group mb-3">
                  <button type="button" onClick={togglePasswordVisibility} class="btn btn-outer" style={{position: 'absolute', right: '40px', marginTop: '5px'}}><i class={`ti ${passwordShow ? 'ti-eye-off' : 'ti-eye'}`}></i></button>
                  <input type={passwordShow ? 'password' : 'text'} class="form-control" placeholder="Password" name="password" value={formvalue.password} onChange={handleChange} />
                </div>
                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary">Login</button>
                  {Object.keys(formError).length !=0 &&
                 <p style={{ color: 'red', textAlign: 'center',margin:'10px' }}>{formError.name}</p>
}
                  
                 
                </div>
                
                </form>
                <div class="d-grid mt-1">
                <button class="btn btn-outline"  onClick={() => setShowModal(true)} >Forgot Password?</button>
              </div>

              <div className="text-center align-items-center mt-4">
                <p><b>Welcome to Pari and Co UPVC App!</b> <br /> Quotation    |   Invoicing    |   Reports</p>
                <button type="button" className="btn btn-secondary px-4" onClick={demoUser}>Demo</button>
              </div>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    
);
    };
    
    export default App;