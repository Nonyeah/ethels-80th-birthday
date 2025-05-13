import { useState, useRef } from "react";

interface AttendanceObj {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  attending: boolean;
  guests: FormDataEntryValue | null;
}

function RSVP() {
  const [fullname, setfullname] = useState<string>("Enter your full name");
  const [email, setemail] = useState<string>("Enter your email address");
  const [otherguests, setotherguests] = useState<string>("0");
  const [accept, setaccept] = useState<boolean>(false);
  const [reject, setreject] = useState<boolean>(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  function send(formData: FormData): Promise<any> | void {
    //create object to send to node js server using formData form control key-value pairs
    const attendanceObj: AttendanceObj = {
      name: formData.get("fname"),
      email: formData.get("email"),
      attending: accept ? true : false,
      guests: formData.get("other"),
    };

    fetch("/guestList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceObj),
    })
      .then((response: Response) => response.json())
      .then((data: string) => {
        messageRef.current!.innerHTML = data;
      })
      .catch((err) => {
        messageRef.current!.textContent = `Hmmm, seems like there's 
        a tech problem: ${err.name}. Please try again later`;
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
    <form action={send}>
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
      <p ref={messageRef} className="message"></p>
    </form>
  );
}

export default RSVP;
