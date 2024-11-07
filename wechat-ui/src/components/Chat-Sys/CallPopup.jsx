import React from 'react';

const CallPopup = ({ open, onClose, onAccept, contact, callType }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {callType === "audio" ? "Incoming Audio Call" : "Incoming Video Call"}
        </h2>
        <p className="mb-4">From: {contact.firstName} {contact.lastName}</p>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Decline</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={onAccept}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default CallPopup;
