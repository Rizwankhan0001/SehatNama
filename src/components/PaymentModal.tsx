import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  doctorName: string;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  doctorName, 
  onPaymentSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      alert('Payment successful! Your appointment is confirmed.');
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">Appointment with {doctorName}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">₹{amount}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Select Payment Method</h4>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="mr-3"
              />
              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
              <span>Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                className="mr-3"
              />
              <Smartphone className="h-5 w-5 mr-2 text-gray-600" />
              <span>UPI (PhonePe, GPay, Paytm)</span>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={(e) => setPaymentMethod(e.target.value as 'netbanking')}
                className="mr-3"
              />
              <Building className="h-5 w-5 mr-2 text-gray-600" />
              <span>Net Banking</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="CVV"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., user@paytm)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="mb-6">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Select Your Bank</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Punjab National Bank</option>
            </select>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;