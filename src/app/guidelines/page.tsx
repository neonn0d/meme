'use client';

import { motion } from 'framer-motion';
import { FiGlobe, FiGithub, FiExternalLink, FiChevronDown, FiServer, FiStar, FiCheck, FiMail, FiArrowRight } from 'react-icons/fi';
import { FaTelegram, FaTwitter, FaDiscord } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

export default function GuidelinesPage() {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">Deployment Guidelines</h1>
          <p className="text-center text-gray-600 mb-8 sm:mb-12">Follow these steps to deploy your website</p>

          <div className="space-y-8 sm:space-y-12">
            {/* GitHub First Step */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiGithub className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Step 1: Upload to GitHub</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                  <p className="font-medium">✨ First step for Vercel or Netlify deployment!</p>
                </div>
                
                <ol className="list-decimal pl-5 space-y-4 text-gray-600">
                  <li>
                    <span className="font-medium">Create a GitHub Account:</span>
                    <div className="mt-2">
                      <a href="https://github.com/signup" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-flex items-center px-4 py-2 bg-[#2DA44E] text-white rounded-lg hover:bg-[#2C974B] transition-colors">
                        Sign Up for GitHub
                        <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  </li>
                  <li>
                    <span className="font-medium">Create a New Repository:</span>
                    <p className="mt-1">Click the "+" icon in the top right → "New repository"</p>
                  </li>
                  <li>
                    <span className="font-medium">Upload Your Files:</span>
                    <p className="mt-1">Click "uploading an existing file" and drag your index.html, main.js, and style.css files</p>
                  </li>
                </ol>

                <div className="mt-6">
                  <button
                    onClick={() => toggleDropdown('github-cli')}
                    className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium">Advanced: Command Line Upload</span>
                    <FiChevronDown 
                      className={`transform transition-transform ${openDropdowns['github-cli'] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdowns['github-cli'] && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <ol className="space-y-3 text-gray-600">
                        <li>Initialize Git repository:
                          <div className="bg-gray-100 p-4 rounded mt-2 space-y-4 font-mono text-sm">
                            <div>git init</div>
                            <div>git add .</div>
                            <div>git commit -m "Initial commit"</div>
                            <div>git branch -M main</div>
                            <div>git remote add origin your-repo-url</div>
                            <div>git push -u origin main</div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vercel Deployment */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" 
                     alt="Vercel Logo" 
                     className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Option 1: Deploy to Vercel (Recommended)</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                  <p className="font-medium">✨ Easiest Method - Just 2 clicks after GitHub!</p>
                </div>
                
                <ol className="list-decimal pl-5 space-y-4 text-gray-600">
                  <li>
                    <span className="font-medium">Create a Vercel Account:</span>
                    <div className="mt-2">
                      <a href="https://vercel.com/signup" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Sign Up with GitHub
                        <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  </li>
                  <li>
                    <span className="font-medium">Import GitHub Repository:</span>
                    <p className="mt-1">Click "Import Project" → Select your GitHub repository → Deploy!</p>
                  </li>
                </ol>
              </div>
            </div>

            {/* Netlify Deployment */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <img src="https://www.netlify.com/v3/img/components/logomark.png" 
                     alt="Netlify Logo" 
                     className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Option 2: Deploy to Netlify</h2>
              </div>
              <div className="space-y-6">
                <ol className="list-decimal pl-5 space-y-4 text-gray-600">
                  <li>
                    <span className="font-medium">Create a Netlify Account:</span>
                    <div className="mt-2">
                      <a href="https://app.netlify.com/signup" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-flex items-center px-4 py-2 bg-[#00AD9F] text-white rounded-lg hover:bg-[#008F84] transition-colors">
                        Sign Up with GitHub
                        <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  </li>
                  <li>
                    <span className="font-medium">Import Project:</span>
                    <p className="mt-1">Click "Add new site" → "Import an existing project" → Select your GitHub repository</p>
                  </li>
                  <li>
                    <span className="font-medium">Deploy:</span>
                    <p className="mt-1">Click "Deploy site" and you're done!</p>
                  </li>
                </ol>
              </div>
            </div>

            {/* Other Hosting Options */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiServer className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Option 3: Other Hosting Providers</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600">You can host your static website on any web hosting provider. Here's what you need:</p>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Required Files</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>index.html (Your main webpage)</li>
                      <li>main.js (JavaScript file)</li>
                      <li>style.css (Styling file)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Popular Hosting Options</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><a href="https://pages.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudflare Pages</a> - Free, fast, and secure</li>
                      <li><a href="https://firebase.google.com/products/hosting" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Hosting</a> - Google's hosting platform</li>
                      <li><a href="https://www.digitalocean.com/products/app-platform" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DigitalOcean App Platform</a> - Simple deployment</li>
                      <li>Traditional hosting (GoDaddy, HostGator, etc.) - Upload via FTP</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Steps for Traditional Hosting</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                      <li>Purchase hosting from your preferred provider</li>
                      <li>Get FTP credentials from your hosting provider</li>
                      <li>Use FileZilla or any FTP client to upload your files</li>
                      <li>Upload all files to the public_html or www folder</li>
                      <li>Your site will be live at your domain!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Registration and Setup */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiGlobe className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Get Your Custom Domain</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                  <p className="font-medium">✨ Make your website professional with a custom domain!</p>
                </div>

                {/* Domain Registration */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Step 1: Buy a Domain</h3>
                  <p className="text-gray-600 mb-4">Popular domain registrars:</p>
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <a href="https://namecheap.com" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="font-medium">Namecheap</span>
                      <span className="ml-auto text-gray-500">From $8.88/year</span>
                    </a>
                    <a href="https://godaddy.com" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="font-medium">GoDaddy</span>
                      <span className="ml-auto text-gray-500">From $9.99/year</span>
                    </a>
                  </div>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                    <li>Choose a domain registrar from above</li>
                    <li>Search for your desired domain name (e.g., yourtoken.com)</li>
                    <li>Complete the purchase and create an account</li>
                    <li>Wait a few minutes for your domain to be registered</li>
                  </ol>
                </div>

                {/* Domain Setup for Different Hosts */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Step 2: Connect Domain to Your Hosting</h3>
                    
                    {/* Vercel Domain Setup */}
                    <div className="mb-6">
                      <h4 className="font-medium text-black mb-2">For Vercel:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                        <li>Go to your Vercel project dashboard</li>
                        <li>Click "Settings" → "Domains"</li>
                        <li>Add your domain name</li>
                        <li>Vercel will provide you with nameserver or DNS records</li>
                        <li>Go to your domain registrar and update the nameservers or DNS records</li>
                        <li>Wait for DNS propagation (usually 5-30 minutes)</li>
                      </ol>
                    </div>

                    {/* Netlify Domain Setup */}
                    <div className="mb-6">
                      <h4 className="font-medium text-black mb-2">For Netlify:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                        <li>Go to your Netlify site settings</li>
                        <li>Click "Domain settings" → "Add custom domain"</li>
                        <li>Enter your domain name</li>
                        <li>Choose between:
                          <ul className="list-disc pl-5 mt-1">
                            <li>Netlify DNS (recommended): Click "Add domain" and update nameservers</li>
                            <li>External DNS: Add the provided DNS records to your registrar</li>
                          </ul>
                        </li>
                        <li>Wait for DNS propagation</li>
                      </ol>
                    </div>

                    {/* Traditional Hosting Domain Setup */}
                    <div className="mb-6">
                      <h4 className="font-medium text-black mb-2">For Traditional Hosting:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                        <li>Log into your hosting control panel</li>
                        <li>Look for "Domains" or "Add Domain" section</li>
                        <li>Add your domain name</li>
                        <li>Go to your domain registrar</li>
                        <li>Update nameservers to your hosting provider's nameservers
                          <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
                            Common nameserver formats:<br/>
                            ns1.yourhost.com<br/>
                            ns2.yourhost.com
                          </div>
                        </li>
                        <li>Wait for DNS propagation</li>
                      </ol>
                    </div>

                    {/* DNS Propagation Note */}
                    <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Note:</h4>
                      <p className="text-yellow-800">DNS changes can take up to 48 hours to fully propagate, but usually complete within 30 minutes. During this time, your domain might work for some people but not others.</p>
                    </div>

                    {/* SSL Certificate */}
                    <div className="bg-green-50 p-4 rounded-lg mt-4">
                      <h4 className="font-medium text-green-800 mb-2">🔒 SSL Certificate:</h4>
                      <p className="text-green-800">Vercel and Netlify automatically provide free SSL certificates for your domain. For traditional hosting, you might need to install it manually or purchase one.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Setup Service */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <FiStar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Need help setting up? 🛠️</h2>
                  </div>
                  <p className="text-purple-600 font-semibold inline-flex items-center">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-sm">LIMITED TIME OFFER ⏰</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                      <h3 className="font-semibold text-lg sm:text-xl text-gray-900">Let us handle everything for you!</h3>
                      <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
                        <div className="bg-purple-600/10 px-3 py-1 rounded-full text-sm font-medium text-purple-700">Only 0.2 SOL</div>
                        <p className="text-xs text-gray-500">Regular price 0.5 SOL</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <FiCheck className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Professional deployment of your website</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiCheck className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Custom domain setup and configuration</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiCheck className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">SSL certificate installation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiCheck className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">24/7 technical support</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link
                      href="/setup-service"
                      className="w-full sm:w-auto px-6 py-3 text-base font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                    >
                      Get Started Now
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiExternalLink className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">Need More Help?</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">Check out these resources for detailed deployment guides:</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <a href="https://vercel.com/docs" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" 
                         alt="Vercel" 
                         className="h-6 w-6 mr-3" />
                    <span>Vercel Guide</span>
                  </a>
                  <a href="https://docs.netlify.com" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src="https://www.netlify.com/v3/img/components/logomark.png" 
                         alt="Netlify" 
                         className="h-6 w-6 mr-3" />
                    <span>Netlify Guide</span>
                  </a>
                  <a href="https://pages.github.com" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiGithub className="h-6 w-6 mr-3" />
                    <span>GitHub Pages Guide</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
