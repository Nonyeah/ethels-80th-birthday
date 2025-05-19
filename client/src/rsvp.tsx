import { useState, useRef } from "react";

interface AttendanceObject {
  name: string;
  email: string;
  otherguests: string | number;
  attending: boolean;
}

function RSVP() {
  const [fullname, setfullname] = useState<string>("Enter your full name");
  const [email, setemail] = useState<string>("Enter your email address");
  const [otherguests, setotherguests] = useState<string | number >("");
  const [accept, setaccept] = useState<boolean>(false);
  const [reject, setreject] = useState<boolean>(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  function send(e: React.FormEvent<HTMLFormElement>) {
    const defaultText = "Enter your full name";
    e.preventDefault();
    if ((!accept && !reject) || !fullname || fullname === defaultText) {
      messageRef.current!.innerHTML =
        "Please complete all form fields and don't forget \
      to click the accept or reject button";
      return false;
    }

    const pattern = /[<\\>]/;
    const refuse = fullname.match(pattern);
    if (refuse) {
      messageRef.current!.innerHTML =
        "Only alpha numeric characters allowed. Please \
       enter your name correctly";
      return false;
    }

    if (fullname.length > 55) {
      messageRef.current!.innerHTML =
        "Your name is too long. Please only enter your first \
     and surname";
      return false;
    }

    const attendanceObject: AttendanceObject = {
      name: fullname,
      email: email,
      otherguests: otherguests,
      attending: accept ? true : false,
    };

    fetch("https://ethels-80th-birthday.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceObject),
    })
      .then((response: Response) => response.text())
      .then((data: string) => {
        messageRef.current!.innerHTML = data;
        messageRef.current!.classList.add("message");
      })
      .then(() =>
        setTimeout(() => {
          setfullname("");
          setemail("");
          setotherguests("");
          setaccept(false);
          setreject(false);
          messageRef.current!.classList.remove("message");
          messageRef.current!.innerHTML = "";
        }, 10000)
      )
      .catch((err) => {
        messageRef.current!.textContent = `Hmmm, seems like there's 
        a tech problem: ${err}. Please try again later`;
      });
  }

  function handleNameFocus(): void {
    setfullname("");
  }

  function handleEmailFocus(): void {
    setemail("");
  }

  function handleAccept(): void {
    setaccept(true);
    setreject(false);
  }

  function handleReject(): void {
    setreject(true);
    setaccept(false);
  }

  return (
    <form onSubmit={send}>
      <div className="form-container">
        <p id="browser-message" ref={messageRef}></p>
        <h2>RSVP</h2>

        <div className="form-name">
          <label>
            Your Name:
            <br />
            <input
              id="fname"
              type="text"
              name="fname"
              value={fullname}
              onChange={(e) => setfullname(e.target.value)}
              onFocus={handleNameFocus}
              required
            />
          </label>
        </div>

        <div className="form-email">
          <label>
            Email Address:
            <br />
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              onFocus={handleEmailFocus}
            />
          </label>
        </div>

        <div className="response-buttons">
          <button
            onClick={handleAccept}
            className={accept ? "accept" : ""}
            name="accept"
            type="button"
          >
            Joyfully Accepts
          </button>
          <button
            onClick={handleReject}
            className={reject ? "reject" : ""}
            type="button"
            name="reject"
          >
            Regretfully Declines
          </button>
        </div>

        <div className="form-others">
          <label>
            Add Additional Guests:
            <br />
            <input
              id="other"
              name="other"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{0,1}"
              value={otherguests}
              onChange={(e) => {
                const guestNumber = e.target.value;
                if (/^\d{0,1}$/.test(guestNumber)) {
                  setotherguests(e.target.value);
                }
              }}
            />
          </label>
        </div>
        <button id="submit" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default RSVP;
