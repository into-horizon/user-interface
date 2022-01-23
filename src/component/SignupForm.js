import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import SignInForm from './SignInForm';
import { signupHandler } from '../store/signup';
import {signInHandlerWithGoogle} from '../store/google';
import {signInHandlerWithFacebook} from '../store/facebook';

import background from "../assets/8.jpg";
import facebook from "../assets/f.png";
import google from "../assets/g.png"
import PhoneInput from 'react-phone-number-input';

import { Country, State }  from 'country-state-city';

import 'react-phone-number-input/style.css'
import "./signUpForm.css";
import {useTranslation} from 'react-i18next'


const SignupForm = (props) => {
console.log('googleUser', props.googleUser);
console.log('provider', props.provider)

const {t}=useTranslation();

const [user,setUser] = useState({})
const [phone, setPhone] = useState()
const [city,setCity]=useState();
    const [values,setValues] =useState({
        first_name:props.googleUser.first_name||'' ,
        last_name:props.googleUser.last_name||'',
        email:props.googleUser.email||'',
        gender:'',
        mobile:'',
        country:'',
        city:'',
        country_code:'' ,
        password:'',
        google_id:props.googleUser.google_id ||'' ,
        facebook_id :props.googleUser.facebook_id||''

    })

    const handleChange = (e) => {
        
        console.log(e.target.name,'name');
        console.log(e.target.value,'value');
        setValues({
            ...values,
            [e.target.name]: e.target.value

        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();

       let obj = {
        first_name:e.target.first_name.value,
        last_name:e.target.last_name.value,
        email:e.target.email.value,
        mobile:e.target.mobile.value,
        country:e.target.country.value,
        city:e.target.city.value,
        country_code:e.target.country_code.value ,
        password:e.target.password.value,
        gender:e.target.gender.value,
        google_id:e.target.google_id.value || null ,
        facebook_id:e.target.facebook_id.value || null
       }
       console.log("🚀 ~ file: SignupForm.js ~ line 46 ~ handleSubmit ~ obj", obj)
        props.signupHandler(obj)
    //   window.location=`http://localhost:3000/signin`
    }
    // const ahmad = async () => {
    //     <SignInForm />
    // }

    useEffect(() => {
    let provider = localStorage.getItem('provider')
        if(window.location.search){
            if(provider=== 'google'){
                props.signInHandlerWithGoogle(window.location.search)
            } else if  (provider === 'facebook') {
                props.signInHandlerWithFacebook(window.location.search)
            }
        }
      
    },[])
    useEffect(() => {
       
        
        console.log("🚀 ~ file: SignupForm.js ~ line 72 ~ SignupForm ~ [props.googleUser", props.googleUser)
        setUser(props.googleUser)
      
    },[props.googleUser])
    useEffect(() => {
       
        
        setUser(props.facebookUser)
        console.log("🚀 ~ file: SignupForm.js ~ line 80 ~ useEffect ~ props.facebookUser.user", props.facebookUser.user)
      
    },[props.facebookUser])

    const getCities =(e)=>{
        let id=document.getElementById('countryId').value
         setCity(State.getStatesOfCountry(String(id)));
       
        }

    return (
        <div className="wrapper">
        <div className="inner">
          <div className="image-holder">
            <img  className='image' src ={background} alt ={background}/>
          </div>
          <form onSubmit={handleSubmit}>
            <h3>{t("text1")}</h3>

            <div className="form-group">
              <input type = "text" placeholder={t("name1")} className="form-control-input" name='first_name' value={user? user.first_name: null} />
              <input type = "text" placeholder={t("name2")} className="form-control-input" name='last_name' value={user? user.last_name: null}/>
            </div>

            <div className="form-wrapper">
                <input type = "text" placeholder={t("em")} className="form-control-input" name='email' value={user?user.email:null}/>

            </div>

            <div className="form-wrapper">
            
                
              <PhoneInput placeholder={t("phone")} international defaultCountry="JO"  name='mobile'   value={phone} onChange={setPhone}/>
              
            </div>


            <div className="form-wrapper">
              <select  id="" className="form-control-input" name ="gender" >
                  <option  value ="Gender"  selected >{t("gen")}</option>
                  <option  value ="male">{t("mal")}</option>
                  <option  value ="female">{t("fem")}</option>
              </select>
            </div>

            <div className="form-wrapper">
              <select  id="countryId" className="form-control-input" name='country' onChange={getCities} >
                  <option  value ="country"  selected >{t("count")}</option>
                  {Country.getAllCountries().map((item,index) => 
                  
                    <option id={item} value ={item.isoCode} key={index}  >{item.name}</option>

                  
                  )}
              </select>
            </div>
            <div className="form-wrapper">
              <select  id="" className="form-control-input" name='city'>
                  <option  value ="City"  selected >{t("city")}</option>
                  {city?city.map((item,index) => 
                    
                    <option  value ={item.name} key={index}>{item.name.split(' ')[0]}</option>

                  
                  ):null}
              </select>
            </div>

            <div className="form-wrapper">
              <input type="password" placeholder={t("pass")} name='password' className="form-control-input"></input>
            </div>

            <div className="form-wrapper">
              <input type="password" placeholder={t("con-pass")} name='password' className="form-control-input"></input>
            </div>

             <button className="ahmad" >{t("register")} </button>

             <div className="SMI">
            <a className="SMA" href="#">
            <input hidden className='input' name='google_id' type='text' value={user? user.google_id:null} />
              <img
                className="SM"
                src={google}
                alt=""
              />
            </a>
            <a className="SMA" href="#">
            <input hidden className='input' name='facebook_id' type='text' value={user? user.google_id:null} />
              <img
                className="SM"
                src={facebook}
                alt=""
              />
            </a>
        
          
          </div>
          <div>
            <a className="btn btn-sign" href="/signIn">{t("sub")} </a>
          </div>
             
          </form>
        </div>
      </div>


    );
}

// export default SignupForm

const mapStateToProps = (state) => ({
    user: state.signupData ? state.signupData : null,
    googleUser : state.signInWithGoogleData ? state.signInWithGoogleData : null,
    provider: state.provider,
    facebookUser: state.signInWithFacebookData ? state.signInWithFacebookData : null,
  });
  
  const mapDispatchToProps = { signupHandler , signInHandlerWithGoogle, signInHandlerWithFacebook};
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
