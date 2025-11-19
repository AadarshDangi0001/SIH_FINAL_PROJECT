import React, { useState } from 'react'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#E8FDFF] flex items-center justify-center p-0 lg:p-4">
      <div className="w-full lg:w-[60vw] max-w-6xl h-screen lg:h-[85vh] bg-white lg:rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Section - Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-white p-4 lg:p-6 flex-col items-center justify-center">
            <img
              src="/imgs/kid3.png"
              alt="Sign up character"
              className="w-full max-w-sm object-contain"
            />
          </div>

          {/* Right Section - Form */}
          <div className="w-full lg:w-1/2 p-6 lg:p-6 flex flex-col justify-center overflow-y-auto relative">
            {/* Logo */}
            <div className="flex justify-end mb-6">
              <img
                src="/imgs/logomini.png"
                alt="Askly Logo"
                className="h-12 lg:h-20 object-contain"
              />
            </div>

            {/* Mobile Character Image */}
            <div className="flex lg:hidden justify-center mb-6">
              <img
                src="/imgs/kid3.png"
                alt="Sign up character"
                className="w-48 h-48 object-contain"
              />
            </div>

            {/* Form Header */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-500 text-sm mb-6">Let's get you all st up so you can access your personal account.</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="john.doe@gmail.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="john.doe@gmail.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••••••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`ri-eye-${showPassword ? 'off' : ''}line text-xl`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••••••••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`ri-eye-${showConfirmPassword ? 'off' : ''}line text-xl`}></i>
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">
                  I agree to all the{' '}
                  <a href="#" className="text-[#FF993A] hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#FF993A] hover:underline">Privacy Policies</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF993A] hover:bg-[#FF8A3D] text-white font-semibold py-2 text-sm rounded-lg transition-colors"
              >
                Create account
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-[#FF993A] hover:underline font-medium">
                  Login
                </a>
              </p>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or Sign up with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Sign up with Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
