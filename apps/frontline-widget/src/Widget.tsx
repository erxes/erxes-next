import { useState } from 'react';

export function Widget() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border rounded-xl shadow-xl flex flex-col z-50">
        <div className="flex justify-between items-center bg-blue-600 text-white px-3 py-2 rounded-t-xl">
          <span className="font-semibold">Chat with us</span>
          <button onClick={() => setOpen(false)}>✖</button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="bg-blue-100 p-2 rounded self-end">Hi there!</div>
        </div>
        <div className="p-2 border-t flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded px-2 py-1"
          />
          <button className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg z-50"
      onClick={() => setOpen(true)}
    >
      <span role="img" aria-label="chat">
        💬
      </span>
    </button>
  );
}
