import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";
import Header from "./header";
import axios from "axios";
import { ReactSession } from 'react-client-session';


ReactSession.setStoreType("localStorage");


function Account() {
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const Empid = ReactSession.get("upvcempid");
    const urlParams = new URLSearchParams(window.location.search);
    const mainuserId = urlParams.get('id');

    const [mainuser, setmainuser] = useState(null);
    const [brandDatas, setBdata] = useState(null);
    const [des, setDes] = useState('');

    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [acHolderName, setAcHolderName] = useState('');
    const [acType, setAcType] = useState('');
    const [acNumber, setAcNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [inputs, setInputs] = useState(null);

    const [profileDetails, setProfileData] = useState(true);
    const [cusprofileDetails, setcusProfileData] = useState(true);
   

    const [gst, setGst] = useState("");
    const [companyaddress, setcompanyAddress] = useState("");  
    const [companylocation, setcompanyLocation] = useState("");  
    const [companycontact, setcompanyContact] = useState(""); 
    const [companyname, setcompanyName] = useState(""); 
    const [companyImage, setcompanyImage] = useState(""); 

   
  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };


    const navigate = useNavigate();
    const indexPath = '/';

    const fetchDatalogcompany = async () => {
      const formData ={
        userId: mainuserId,
        companyname: companyname,
        companycontact:companycontact,
        companyaddress:companyaddress,
        companylocation:companylocation,
        companyImage:companyImage,
        gst:gst
      };
     
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Update Company Details":formData});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  
    const fetchDatalog = async () => {
      const formData={
        mainuserId:mainuserId,
        file: image,
        name: name,
        email:email,
        phone:contact,
        address:address,
        location:location,
        regid:regId,
        profiles: {} // Initialize as an empty object
      };
      
      // Populate the profiles object with indexed keys
      profiles.forEach((profile, index) => {
        formData.profiles[`profile_${index}`] = profile; // Use a custom key
      });

     
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Update Mainuser Details":formData});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/profiles/', user);
          setProfileData(response.data);
        } catch (error) {
        } 
      };
  
      fetchData();
    }, [profileDetails]);

   
  
 
    
  const MainuserData = async () =>{
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/main-users/');
     // console.log(response.data);
      if(response.data.status === 'success'){
        const filteredmainuser = response.data && response.data.data.filter(mainuser => mainuser.user_id === mainuserId);
        setmainuser(filteredmainuser);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };



  const brandData = async () => {
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/company/', {params: { userId: mainuserId }});
      //console.log(response.data.data);
      if(response.data.status === 'success'){
        setDes(response.data.data[0].companyTerms);
        setBankName(response.data.data[0].companyBank);
        setBranchName(response.data.data[0].companyBranch);
        setAcHolderName(response.data.data[0].companyBankerName);
        setAcType(response.data.data[0].companyBankType);
        setAcNumber(response.data.data[0].companyAcNum);
        setIfsc(response.data.data[0].companyIfsc);

        setcompanyAddress(response.data.data[0].companyAddress);
        setcompanyLocation(response.data.data[0].companyLocation);
        setcompanyContact(response.data.data[0].companyContact);
        setcompanyName(response.data.data[0].companyName);
        setcompanyImage(response.data.data[0].companyLogo);
        setGst(response.data.data[0].companyGst);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } 
  };
    
  useEffect(() => {
    brandData();
    MainuserData(); 
  },[]);


  const handlecompanyInputChange = (event) => {
    setGst(event.target.value);
  };

  const handlecompanyInputChangeaddress = (event) => {
    setcompanyAddress(event.target.value);
  };

  const handlecompanyInputChangelocation = (event) => {
    setcompanyLocation(event.target.value);
  };

  const handlecompanyInputChangeContact = (event) => {
    setcompanyContact(event.target.value);
  };

  const handlecompanyInputChangename = (event) => {
    setcompanyName(event.target.value);
  };

  const handlecompanyChangeFile = (event) => {
    const file = event.target.files[0];
      if (file) {
        setcompanyImage(file); 
      }
  };






  
const handlecompanySubmit = async (event) => {
  event.preventDefault();
  fetchDatalogcompany();

  const formData = new FormData();
  formData.append('userId', mainuserId);
  formData.append('cName', companyname);
  formData.append('cContact', companycontact);
  formData.append('cAddress', companyaddress);
  formData.append('cLocation', companylocation);
  formData.append('file', companyImage);
  formData.append('cGst', gst);
  
 
  try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/company/', formData);
   //   console.log(response.data);
      if(response.data.status === 'success'){
        brandData();
      }
     
  } catch (error) {
      console.error('Error:', error);
  }
};
  

    const [regId, setRegId] = useState("");
    const [email, setEmail] = useState("");  
    const [address, setAddress] = useState("");  
    const [location, setLocation] = useState("");  
    const [contact, setContact] = useState(""); 
    const [profiles, setProfiles] = useState([]); 
    const [name, setName] = useState(""); 
    const [image, setImage] = useState(""); 

  
    useEffect(() => {

      setRegId(mainuser?.[0]?.user_regIdgid);
      setEmail(mainuser?.[0]?.user_email);
      setAddress(mainuser?.[0]?.user_address);
      setLocation(mainuser?.[0]?.user_location);
      setContact(mainuser?.[0]?.user_mobile);
      setName(mainuser?.[0]?.user_name);
      setImage(mainuser?.[0]?.user_image);

   },[mainuser]);

  const handleInputChange = (event) => {
    setRegId(event.target.value);
  };

  const handleInputChangeEmail = (event) => {
    setEmail(event.target.value);
  };


  const handleInputChangeaddress = (event) => {
    setAddress(event.target.value);
  };

  const handleInputChangelocation = (event) => {
    setLocation(event.target.value);
  };

  const handleInputChangeContact = (event) => {
    setContact(event.target.value);
  };

  const handleInputChangename = (event) => {
    setName(event.target.value);
  };

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
      if (file) {
        setImage(file); 
      }
  };
  

  const handleProfileChange = (event) => {
    const newValue = event.target.value;
    setProfiles((prevValues) => {
        if (prevValues.includes(newValue)) {
            // Remove the profile if it already exists
            return prevValues.filter(value => value !== newValue);
        } else {
            // Add the profile if it does not exist
            return [...prevValues, newValue];
        }
    });
};



const handleSubmit = async (event) => {
  event.preventDefault();
  fetchDatalog();

  const formDatas = new FormData();
  formDatas.append('id', mainuserId);
  formDatas.append('name', name);
  formDatas.append('email', email);
  formDatas.append('phone', contact);
  formDatas.append('address', address);
  formDatas.append('location', location);
  formDatas.append('image', image);
  formDatas.append('regid', regId);
  profiles.forEach((profile, index) => {
    formDatas.append(`profiles[${index}]`, profile);
  });
  try {
     const response = await axios.post('https://upvcapi.sninfoserv.com/edit-user/', formDatas);
    // console.log(response.data);
     if(response.data.status === 'success'){
       MainuserData(); 
     }
  } catch (error) {
      console.error('Error:', error);
  }
};

  
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/profiles/', {userId: mainuserId});
      setcusProfileData(response.data);
    } catch (error) {
    } 
  };

  fetchData();
}, []);



useEffect(() => {
  if (cusprofileDetails && cusprofileDetails.data) {
    cusprofileDetails.data.forEach(cusProfiles => {
      const newValue = cusProfiles.profileId;
      setProfiles((prevValues) => {
        if (!prevValues.includes(newValue)) {
          return [...prevValues, newValue];
        }
        return prevValues;
      });
    });
  }
}, [cusprofileDetails]);

  
  return (
        <div>
            <Navbar />
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    <div className="row">
                   


                      <div class="col-md-12 col-xxl-12 col-xl-12">
            <div class="card">
              <div class="card-body">
                <h4 class="mb-4">Brand Details</h4>
                <div class="row">
                  <div class="col-md-6 col-xxl-3 col-xl-3 mt-4">
                    <img src={`https://upvcapi.sninfoserv.com/user/images/${companyImage}`}width="160px" />
                  </div>
                  <div class="col-md-6 col-xxl-9 col-xl-9 mt-4">
                  <form onSubmit={handlecompanySubmit}>
                  <div class="row">
                   
                  <div class="col-md-6 col-xxl-6 col-xl-6 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Name:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="cName"
                        value={companyname}
                        onChange={handlecompanyInputChangename}
                      />
                    </p>
                    </div>
                    
                    
                    <div class="col-md-6 col-xxl-6 col-xl-6 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>GSTIN:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="cGst "
                        value={gst}
                        onChange={handlecompanyInputChange}
                      />
                    </p>
                    </div>

                    <div class="col-md-12 col-xxl-12 col-xl-12 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Address:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="cAddress "
                        value={companyaddress}
                        onChange={handlecompanyInputChangeaddress}
                      />
                    </p>
                    </div>
                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Location:</span>
                      <input
                        type="text"
                        className="form-control"
                         name="cLocation"
                        value={companylocation}
                        onChange={handlecompanyInputChangelocation}
                      />
                    </p>
                    </div>
                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Contact:</span>
                      <input
                        type="text"
                        className="form-control"
                         name="cContact"
                        value= {companycontact}
                        onChange={handlecompanyInputChangeContact}
                      />
                    </p>
                    </div>

                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Image:</span>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="file"
                        accept="image/*"
                        onChange={handlecompanyChangeFile}
                      />
                    </p>
                    </div>

                   

                    <div class="col-12 mb-2 mt-3" align="center">
                          <button  class=" btn btn-success mt-2 w-25">Update</button>
                        </div>
                   
                    </div>
                    </form>
                  </div>
                  </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="mb-4">Customer Details</h4>
                <div class="row">
                  <div class="col-md-6 col-xxl-3 col-xl-3 mt-4">
                    <img src={`https://upvcapi.sninfoserv.com/user/images/${mainuser && mainuser[0].user_image}`} width="160px" />
                    <p class="text-sm mt-4">Quotes : { mainuser && mainuser[0].user_quotes}</p>
                    <p class="text-sm">Clients : { mainuser && mainuser[0].user_clients}</p>
                    <p class="text-sm">Engineers : { mainuser && mainuser[0].user_engineers}</p>
                    <p class="text-sm">Profiles : { mainuser && mainuser[0].user_profiles}</p>
                  </div>
                  <div class="col-md-6 col-xxl-9 col-xl-9 mt-1">
                 
                    <div class="row">
                  
                    <div class="col-md-12 col-xxl-12 col-xl-12 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Name:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={handleInputChangename}
                      />
                    </p>
                    </div>
                    
                    
                    <div class="col-md-6 col-xxl-6 col-xl-6 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>RegId:</span>
                      <input
                        type="text"
                        className="form-control"
                         name="regid"
                        value={regId}
                        onChange={handleInputChange}
                      />
                    </p>
                    </div>
                    <div class="col-md-6 col-xxl-6 col-xl-6 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Email:</span>
                      <input
                        type="text"
                        className="form-control"
                         name="email"
                        value={email}
                        onChange={handleInputChangeEmail}
                      />
                    </p>
                    </div>
                    <div class="col-md-12 col-xxl-12 col-xl-12 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Address:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={address}
                        onChange={handleInputChangeaddress}
                      />
                    </p>
                    </div>
                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Location:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={location}
                        onChange={handleInputChangelocation}
                      />
                    </p>
                    </div>
                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Contact:</span>
                      <input
                        type="text"
                        className="form-control"
                         name="contact"
                        value={contact}
                        onChange={handleInputChangeContact}
                      />
                    </p>
                    </div>

                    <div class="col-md-6 col-xxl-3 col-xl-3 mt-1">
                    <p className="text-sm">
                      <span style={{ marginRight: '10px' }}>Image:</span>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                      />
                    </p>
                    </div>
                   
                  
                    <div class="col-md-12 col-xxl-12 col-xl-12 mt-1">
    <p>Select Profiles</p>
    <div className="row">
        {profileDetails?.data?.map((profile) => (
            <div className="col-md-3 col-xxl-3 col-xl-3 mb-2" key={profile.profileId}>
                <button
                    className={profiles.includes(profile.profileId) ? "btn btn-primary w-100" : "btn btn-secondary w-100"}
                    name="profile"
                    value={profile.profileId}
                    onClick={handleProfileChange}
                >
                    {profile.profileName}
                </button>
            </div>
        ))}
    </div>
</div>


<div class="col-12 mb-2 mt-3" align="center">
                          <button onClick={handleSubmit} class=" btn btn-success mt-2 w-25">Update</button>
                        </div>



</div>

                  
                  </div>
                </div>
              </div>
            </div>
          </div>


                        
                      <div class="col-md-12 col-xxl-12 col-xl-12">
            <div class="card">
          
              <div class="card-body">
              <h4 class="mb-4">Employees Details</h4>
                <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                     
                      <th>Subuser</th>
                      <th>EmpID</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                  
                  { mainuser && mainuser[0].user_subUsers.map((subuser, index) => (
                <tr key={index}>
                  <td>{subuser.subUser_name}</td>
                  <td>{subuser.subUser_regId}</td>
                  <td>{subuser.subUser_email}</td>
                  <td>{subuser.subUser_phone}</td>
                 
                  </tr>
              ))} 
                  </tbody>
                </table>
              </div>
            </div>
          </div>

                    
                    
                    
                    
                     







                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
