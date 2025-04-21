import React, { useState } from "react";

export default function CommentForm({ blogId, parentId, onSubmitted }) {
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/submitComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId, text, authorName, email, parentId }),
    });
    const json = await res.json();
    setLoading(false);
    setMsg(json.message || "Something went wrong");

    if (res.ok) {
      setAuthorName("");
      setEmail("");
      setText("");
      onSubmitted && onSubmitted(); // refresh list
      alert("Thanks! Check your email to confirm your comment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="font-heading text-2xl">Leave a Comment</h1>
      <h3 className="font-heading">
        Email will not be shown. All fields are required.
      </h3>

      <input
        placeholder="Name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="border px-2 py-1 w-full bg-[#dee7e7] font-body"
      />
      <input
        placeholder="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 w-full bg-[#dee7e7] font-body"
      />
      <textarea
        placeholder="Comment"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-2 py-1 w-full bg-[#dee7e7] font-body"
      />
      <button className="btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Post comment"}
      </button>
      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  );
}
