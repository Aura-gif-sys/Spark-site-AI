import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./style.css";

const initial = {
  name: "",
  tagline: "",
  about: "",
  phone: "",
  email: "",
  location: "",
  services: [""]
};

function Preview({ site }) {
  return (
    <div className="site">
      <section className="hero">
        <small>{site.location}</small>
        <h1>{site.name || "Your Business"}</h1>
        <p>{site.tagline || "Your professional tagline"}</p>

        {site.phone && (
          <a href={"tel:" + site.phone}>Contact Us</a>
        )}
      </section>

      <section>
        <h2>About us</h2>
        <p>
          {site.about || "Tell customers about your business."}
        </p>
      </section>

      <section>
        <h2>Our services</h2>

        <div className="services">
          {site.services
            .filter(Boolean)
            .map((service, index) => (
              <article key={index}>
                <h3>{service}</h3>
                <p>Professional and dependable service.</p>
              </article>
            ))}
        </div>
      </section>

      <section className="contact">
        <h2>Let's work together</h2>
        <p>
          {site.phone}
          {site.email && " · " + site.email}
        </p>
      </section>

      <footer>
        © {new Date().getFullYear()}{" "}
        {site.name || "Your Business"}
      </footer>
    </div>
  );
}

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [error, setError] = useState("");

  async function handleAuth() {
    setError("");

    try {
      if (createAccount) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="auth">
      <div className="panel">
        <h1>SiteForge</h1>

        <p>
          Build and publish your business website.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <button className="blue" onClick={handleAuth}>
          {createAccount ? "Create account" : "Log in"}
        </button>

        {error && (
          <p className="error">{error}</p>
        )}

        <button
          className="link"
          onClick={() =>
            setCreateAccount(!createAccount)
          }
        >
          {createAccount
            ? "Already have an account? Log in"
            : "Create a new account"}
        </button>
      </div>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(undefined);
  const [site, setSite] = useState(initial);
  const [status, setStatus] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadWebsite() {
      const snapshot = await getDoc(
        doc(db, "users", user.uid)
      );

      if (snapshot.exists()) {
        setSite({
          ...initial,
          ...snapshot.data()
        });
      }
    }

    loadWebsite();
  }, [user]);

  if (user === undefined) {
    return (
      <div className="loading">
        Loading SiteForge...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  function update(field, value) {
    setSite((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function saveWebsite() {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        site,
        { merge: true }
      );

      setStatus("Website saved to Firebase ✓");

      setTimeout(() => {
        setStatus("");
      }, 3000);
    } catch (error) {
      setStatus("Could not save website.");
      console.error(error);
    }
  }

  return (
    <>
      <header>
        <div>
          <b>SiteForge</b>
          <span>Build. Publish. Grow.</span>
        </div>

        <div>
          <span>{user.email}</span>

          <button onClick={() => signOut(auth)}>
            Log out
          </button>
        </div>
      </header>

      <main>
        <div className="editor panel">
          <h1>Build your website</h1>

          <p className="muted">
            Your project is connected to Firebase.
          </p>

          <label>
            Business name
            <input
              value={site.name}
              onChange={(event) =>
                update("name", event.target.value)
              }
            />
          </label>

          <label>
            Tagline
            <input
              value={site.tagline}
              onChange={(event) =>
                update("tagline", event.target.value)
              }
            />
          </label>

          <label>
            Phone
            <input
              value={site.phone}
              onChange={(event) =>
                update("phone", event.target.value)
              }
            />
          </label>

          <label>
            Email
            <input
              value={site.email}
              onChange={(event) =>
                update("email", event.target.value)
              }
            />
          </label>

          <label>
            Location
            <input
              value={site.location}
              onChange={(event) =>
                update("location", event.target.value)
              }
            />
          </label>

          <label>
            About
            <textarea
              value={site.about}
              onChange={(event) =>
                update("about", event.target.value)
              }
            />
          </label>

          <label>
            Services — one per line
            <textarea
              value={site.services.join("\n")}
              onChange={(event) =>
                update(
                  "services",
                  event.target.value.split("\n")
                )
              }
            />
          </label>

          <button
            className="blue"
            onClick={saveWebsite}
          >
            Save website
          </button>

          {status && (
            <p className="success">{status}</p>
          )}
        </div>

        <div className="preview panel">
          <h3>Live preview</h3>
          <Preview site={site} />
        </div>
      </main>
    </>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
