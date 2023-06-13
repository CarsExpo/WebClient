import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [otpResent, setOtpResent] = useState(false);

  useEffect(() => {
    if (location.state?.fromInscription !== true) {
      navigate('/');
    }
  }, [location]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const focusInput = (inputIndex) => {
    if (inputRefs.current[inputIndex]) {
      inputRefs.current[inputIndex].focus();
    }
  };

  const handleInputChange = (e, index) => {
    let value = e.target.value;
    value = value.replace(/\s/g, '');
    if (/^[0-9]+$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (index < otp.length - 1) {
        focusInput(index + 1);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index - 1] = '';
          return newOtp;
        });
        focusInput(index - 1);
      } else {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index] = '';
          return newOtp;
        });
      }
      e.target.value = '';
    }
  };

  const handlePaste = (e, index) => {
    const pasteData = e.clipboardData.getData('Text');
    const otpArray = pasteData.replace(/\s/g, '').split('').slice(0, 6);

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      otpArray.forEach((digit, idx) => {
        if (newOtp[idx] !== undefined) {
          newOtp[idx] = digit;
        }
      });
      return newOtp;
    });
  };

  const setInputRef = (ref, index) => {
    inputRefs.current[index] = ref;
  };

  const emailse = sessionStorage.getItem('emailse');

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("");
    try {
      const response = await axios.post(API_BASE_URL + '/api/auth/verify-otp', {
        email: emailse,
        otp: otpValue
      }, {
        withCredentials: true,
      });

      if (response.status == 200) {
        setErrorMsg(null);
        sessionStorage.removeItem('emailse');
        navigate('/login')
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg(error.response.data.message);
      } else {
        if (error.response) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Une erreur s'est produite lors de la vérification de l'OTP");
        }
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/auth/resend-otp', { email: emailse }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setErrorMsg(null);
        setOtpResent(true);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg(error.response.data.message);
        setOtpResent(false);  // Important: réinitialiser l'état à faux en cas d'échec
      } else {
        setErrorMsg("Une erreur s'est produite lors de l'envoi de l'OTP");
        setOtpResent(false);  // Important: réinitialiser l'état à faux en cas d'échec
      }
    }
  };

  return (
    <div className="otp-con">
      <form className="otp-form" onSubmit={handleOTPSubmit}>
        <h2>Vérification OTP</h2>
        <div className="otp-field">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => setInputRef(ref, index)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
            />
          ))}
        </div>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {errorMsg === 'OTP invalide ou expiré' && !otpResent && <button type="button" onClick={handleResendOTP}>Renvoyer le code OTP</button>}
        {otpResent && <p>Email renvoyé avec succès</p>}
        <p>L'e-mail a été envoyé à : {emailse}</p>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

export default Otp;