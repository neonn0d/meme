import { PreviewData } from '@/types';

export const generateStellarHTML = ({
    coinName,
    tokenSymbol,
    description,
    logoUrl,
    contractAddress,
    buyLink,
    roadmap = { phases: [] },
    team = [],
    socialLinks = { telegram: '', twitter: '', discord: '' },
    tokenomics = { totalSupply: '0', taxBuy: '0', taxSell: '0', lpLocked: '0' },
    faq = [],
    seo = { title: '', description: '', keywords: '', ogImage: '' },
    sections = { hero: true, tokenomics: false, roadmap: false, team: false, faq: false, community: false },
    primaryColor,
    secondaryColor
}: PreviewData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${coinName} - ${tokenSymbol}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${seo.description || description}">
    <meta name="keywords" content="${seo.keywords || coinName + ', ' + tokenSymbol + ', cryptocurrency, token, blockchain'}">
    
    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:title" content="${seo.title || coinName + ' - ' + tokenSymbol}">
    <meta property="og:description" content="${seo.description || description}">
    <meta property="og:image" content="${seo.ogImage || logoUrl}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title || coinName + ' - ' + tokenSymbol}">
    <meta name="twitter:description" content="${seo.description || description}">
    <meta name="twitter:image" content="${seo.ogImage || logoUrl}">
    
    <!-- Favicon -->
    <link rel="icon" href="${logoUrl}" type="image/x-icon">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${primaryColor}',
                        secondary: '${secondaryColor}',
                    },
                    animation: {
                        float: 'float 6s ease-in-out infinite',
                        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                        }
                    },
                },
            },
        }
    </script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        html {
            scroll-behavior: smooth;
        }
        .container {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-image: linear-gradient(to bottom, #0f172a, #020617);
            background-size: 100% 300px;
            background-position: 0% 100%;
            background-repeat: no-repeat;
            color: white;
            overflow-x: hidden;
        }
        .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body class="bg-gray-950">
    <!-- Navigation -->
    <nav class="py-4 sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center">
                <a href="#" class="flex items-center gap-2">
                    <img src="${logoUrl}" alt="${coinName} Logo" class="w-10 h-10 object-contain">
                    <span class="font-bold text-xl">${tokenSymbol}</span>
                </a>
                <div class="hidden md:flex items-center gap-6">
                    ${sections.tokenomics ? `<a href="#tokenomics" class="hover:text-primary transition">Tokenomics</a>` : ''}
                    ${sections.roadmap ? `<a href="#roadmap" class="hover:text-primary transition">Roadmap</a>` : ''}
                    ${sections.team ? `<a href="#team" class="hover:text-primary transition">Team</a>` : ''}
                    ${sections.faq ? `<a href="#faq" class="hover:text-primary transition">FAQ</a>` : ''}
                    <a href="${buyLink}" class="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full font-medium transition">Buy Now</a>
                </div>
                <button class="md:hidden text-2xl" id="mobile-menu-button">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
    
    <!-- Mobile Menu -->
    <div class="fixed inset-0 bg-gray-950/95 z-40 hidden flex-col pt-20 px-4 backdrop-blur-md" id="mobile-menu">
        <button class="absolute top-6 right-4 text-2xl" id="close-menu-button">
            <i class="fas fa-times"></i>
        </button>
        <div class="flex flex-col gap-6 items-center text-xl">
            ${sections.tokenomics ? `<a href="#tokenomics" class="hover:text-primary transition">Tokenomics</a>` : ''}
            ${sections.roadmap ? `<a href="#roadmap" class="hover:text-primary transition">Roadmap</a>` : ''}
            ${sections.team ? `<a href="#team" class="hover:text-primary transition">Team</a>` : ''}
            ${sections.faq ? `<a href="#faq" class="hover:text-primary transition">FAQ</a>` : ''}
            <a href="${buyLink}" class="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-full font-medium transition w-full text-center mt-4">Buy Now</a>
        </div>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="min-h-screen flex items-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div class="container mx-auto px-4 py-16 z-10 relative">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="md:w-1/2 mb-10 md:mb-0">
                    <h1 class="text-4xl md:text-6xl font-bold mb-4">${coinName}</h1>
                    <p class="text-lg text-gray-300 mb-8">${description}</p>
                    <div class="flex flex-wrap gap-4">
                        <a href="${buyLink}" class="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-full font-bold transition">Buy Now</a>
                        <button id="contract-button" class="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold transition" data-contract="${contractAddress}">
                            <span>${contractAddress.substring(0, 6)}...${contractAddress.substring(contractAddress.length - 4)}</span>
                            <i class="ml-2 fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="md:w-1/2 flex justify-end">
                    <div class="relative">
                        <div class="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                        <img src="${logoUrl}" alt="${coinName} Logo" class="w-64 h-64 2xl:w-80 2xl:h-80 object-contain relative z-10 animate-float">
                    </div>
                </div>
            </div>
        </div>
    </section>

    ${sections.tokenomics ? `
    <!-- Tokenomics Section -->
    <section id="tokenomics" class="py-20 relative">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Tokenomics</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition flex flex-col items-center reveal">
                    <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-rocket text-primary text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Total Supply</h3>
                    <p class="text-gray-300 text-center">${Number(tokenomics.totalSupply).toLocaleString()}</p>
                </div>
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition flex flex-col items-center reveal">
                    <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-money-bill-wave text-primary text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Buy Tax</h3>
                    <p class="text-gray-300 text-center">${tokenomics.taxBuy}%</p>
                </div>
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition flex flex-col items-center reveal">
                    <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-chart-line text-primary text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Sell Tax</h3>
                    <p class="text-gray-300 text-center">${tokenomics.taxSell}%</p>
                </div>
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition flex flex-col items-center reveal">
                    <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-lock text-primary text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">LP Locked</h3>
                    <p class="text-gray-300 text-center">${tokenomics.lpLocked}</p>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.roadmap && roadmap?.phases?.length ? `
    <!-- Roadmap Section -->
    <section id="roadmap" class="py-20 relative">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Roadmap</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${roadmap.phases.map((phase: any, index: number) => `
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition reveal">
                    <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                        ${index + 1}
                    </div>
                    <h3 class="text-xl font-bold mb-2">${phase.title}</h3>
                    <p class="text-gray-300">${phase.description}</p>
                    <p class="text-gray-400 text-sm mt-4">${phase.date}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.team ? `
    <!-- Team Section -->
    <section id="team" class="py-20 relative">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Our Team</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${team.map((member: any) => `
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition text-center reveal">
                    <img src="${member.avatar}" alt="${member.name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-primary/50">
                    <h3 class="text-xl font-bold mb-1">${member.name}</h3>
                    <p class="text-primary">${member.role}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.faq ? `
    <!-- FAQ Section -->
    <section id="faq" class="py-20 relative">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">FAQ</h2>
            <div class="grid grid-cols-1 gap-6">
                ${faq.map((item: any, index: number) => `
                <div class="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition reveal">
                    <h3 class="text-xl font-bold mb-4">${item.question}</h3>
                    <p class="text-gray-300">${item.answer}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.community ? `
    <!-- Community Section -->
    <section id="community" class="py-20 relative">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-8">Join Our Community</h2>
            <p class="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">Be part of our growing community and stay updated with the latest news and developments.</p>
            <div class="flex justify-center gap-6 flex-wrap">
                ${socialLinks.telegram ? `<a href="${socialLinks.telegram}" target="_blank" class="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-800 hover:border-primary/50 transition flex items-center gap-3 reveal"><i class="fab fa-telegram-plane text-2xl text-primary"></i><span>Telegram</span></a>` : ''}
                ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" class="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-800 hover:border-primary/50 transition flex items-center gap-3 reveal"><i class="fab fa-twitter text-2xl text-primary"></i><span>Twitter</span></a>` : ''}
                ${socialLinks.discord ? `<a href="${socialLinks.discord}" target="_blank" class="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-800 hover:border-primary/50 transition flex items-center gap-3 reveal"><i class="fab fa-discord text-2xl text-primary"></i><span>Discord</span></a>` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Footer -->
    <footer class="py-8 border-t border-gray-800">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center gap-2 mb-4 md:mb-0">
                    <img src="${logoUrl}" alt="${coinName} Logo" class="w-8 h-8 object-contain">
                    <span class="font-bold">${tokenSymbol}</span>
                </div>
                <p class="text-gray-400 text-sm">&copy; ${new Date().getFullYear()} ${coinName}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Copy contract address
        document.getElementById('contract-button').addEventListener('click', function() {
            const contract = this.getAttribute('data-contract');
            navigator.clipboard.writeText(contract).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<span>Copied!</span>';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });

        // Mobile menu
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            document.getElementById('mobile-menu').style.display = 'flex';
        });

        document.getElementById('close-menu-button').addEventListener('click', function() {
            document.getElementById('mobile-menu').style.display = 'none';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('mobile-menu').style.display = 'none';
            });
        });

        // Reveal animations
        function reveal() {
            const reveals = document.querySelectorAll('.reveal');
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const revealTop = reveals[i].getBoundingClientRect().top;
                const revealPoint = 150;
                if (revealTop < windowHeight - revealPoint) {
                    reveals[i].classList.add('active');
                }
            }
        }

        window.addEventListener('scroll', reveal);
        window.addEventListener('load', reveal);
    </script>
</body>
</html>`;
};
