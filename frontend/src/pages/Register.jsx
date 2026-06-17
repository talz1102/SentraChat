import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", formData);

    alert("Mock register successful (DB disabled)");
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;