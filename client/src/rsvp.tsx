import { useState, useRef } from "react";

interface AttendanceObject {
  name: string,
  email: string,
  otherguests: string,
  attending: boolean
}

function RSVP() {
  const [fullname, setfullname] = useState<string>("Enter your full name");
  const [email, setemail] = useState<string>("Enter your email address");
  const [otherguests, setotherguests] = useState<string>("0");
  const [accept, setaccept] = useState<boolean>(false);
  const [reject, setreject] = useState<boolean>(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  function send(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!accept && !reject) {
      messageRef.current!.innerHTML = "Please accept or decline the invitaion by clicking the \
      relevant button";
      return false;
    }
    const attendanceObject: AttendanceObject = {
      name: fullname,
      email: email,
      otherguests: otherguests,
      attending: accept ? true : false
    }
    

    fetch("http://localhost:3000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceObject),
    })
      .then((response: Response) => response.text())
      .then((data: string) => {
        messageRef.current!.innerHTML = data;
        messageRef.current!.classList.add("message")
      })
      .then(() => setTimeout(() => {
        setfullname("");
        setemail("");
        setotherguests("0"); 
        setaccept(false);
        setreject(false);
        messageRef.current!.classList.remove("message");
        messageRef.current!.innerHTML = "";
      }, 8000))
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
    if (!accept || reject) {
      setaccept(true);
      setreject(false);
    }
  }

  function handleReject(): void {
    if (!reject || accept) {
      setreject(true);
      setaccept(false);
    }
  }

  return (
    <form onSubmit={send}>
      <div className="form-container">
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
              required
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
              type="number"
              value={otherguests >= "0" ? otherguests : "0"}
              onChange={(e) => {
                if (otherguests) setotherguests(e.target.value);
              }}
              required
            />
          </label>
        </div>
        <button id="submit" type="submit">
          Submit
        </button>
      </div>
      <p ref={messageRef}></p>
    </form>
  );
}

export default RSVP;
