import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Building2,
  Smartphone,
  Laptop,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import useAxios from 'axios-hooks';
import { login } from '@/apis/auth';
import { setUserLoginData } from '@/store/slices/persistedSlice';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [, executeLogin] = useAxios(login(), { manual: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await executeLogin({
        data: { email: formData.email, password: formData.password },
      });

      dispatch(setUserLoginData(data));

      navigate('/funds');
    } catch (error) {
      setErrors({ form: 'Invalid credentials. Please try again.' + error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Feature list for the side panel
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      text: 'Bank-level Security',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      text: 'Mobile First Design',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: <Laptop className="w-6 h-6" />,
      text: 'Cross-Platform Sync',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Real-time Analytics',
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Brand/Feature Panel - Takes full height */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white hidden lg:flex flex-col">
        {/* Top Branding */}
        <div className="p-8 lg:p-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SUNNY AI</h1>
              <p className="text-primary-100 text-sm">
                Enterprise Fund Management
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Takes available space */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Manage Your Funds <br />
              <span className="text-primary-200">Like a Pro</span>
            </h2>
            <p className="text-lg text-primary-100 mb-10">
              Join thousands of financial professionals using our platform to
              streamline fund management, track investments, and make
              data-driven decisions.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${feature.color} bg-opacity-20`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-primary-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$500M+</div>
                <div className="text-sm text-primary-200">Assets Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-primary-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-8 lg:p-12 border-t border-white/10">
          <p className="text-sm text-primary-200">
            © 2026 SUNNY AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile Header (Hidden on desktop) */}
      <div className="lg:hidden bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FundFlow Pro</h1>
              <p className="text-primary-100 text-xs">
                Enterprise Fund Management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form - Takes full height */}
      <div className="lg:w-1/2 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        {/* Scrollable container for mobile */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Welcome Section */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2 lg:text-lg">
                Sign in to your account to continue
              </p>
            </div>

            {/* Login Card */}
            <Card className="shadow-xl lg:shadow-2xl border-0">
              <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    startIcon={<Mail className="w-5 h-5" />}
                    aria-describedby="email-error"
                    className="text-base lg:text-sm bg-white" // Fixed: Added bg-white
                  />
                  {errors.email && (
                    <div
                      id="email-error"
                      className="flex items-center gap-1 mt-2 text-sm text-red-600"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    startIcon={<Lock className="w-5 h-5" />}
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    }
                    aria-describedby="password-error"
                    className="text-base lg:text-sm bg-white" // Fixed: Added bg-white
                  />
                  {errors.password && (
                    <div
                      id="password-error"
                      className="flex items-center gap-1 mt-2 text-sm text-red-600"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {errors.form && (
                  <div className="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{errors.form}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 lg:mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mt-4 lg:mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors active:scale-95"
                    onClick={() => console.log('Google login')}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors active:scale-95"
                    onClick={() => console.log('Microsoft login')}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 23 23"
                    >
                      <path d="M0 0h11v11H0V0zm12 0h11v11H12V0zM0 12h11v11H0V12zm12 0h11v11H12V12z" />
                    </svg>
                    Microsoft
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 lg:mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Get started free
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  14-day trial • No credit card required
                </p>
              </div>
            </Card>

            {/* Footer Links */}
            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Privacy Policy
                </Link>
                .{' '}
                <Link
                  to="/security"
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Learn about our security
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Need help?{' '}
            <Link to="/support" className="text-primary-600 font-medium">
              Contact Support
            </Link>
          </div>
          <div className="text-xs text-gray-500">© 2026 SUNNY AI</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
