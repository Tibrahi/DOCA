/**
 * DOCA v2.0 - Core Logic
 * Handles dynamic menu generation and SPA routing.
 */

// 1. 📂 THE DATA STRUCTURE (Single Source of Truth)
const DOCUMENT_LIBRARY = {
    "Core Professional": [
        "White Paper", "Research Paper", "Technical Report", "Case Study", 
        "Literature Review", "System Design Document", "Feasibility Study", 
        "Impact Assessment Report", "Policy Brief"
    ],
    "Career & Academic": [
        "CV (Curriculum Vitae)", "Resume", "Statement of Purpose (SOP)", 
        "Personal Statement", "Letter of Intent (Academic)", "Motivation Letter", 
        "Cover Letter", "Academic Portfolio", "Teaching Philosophy Statement", 
        "Research Proposal", "Thesis Proposal", "Dissertation", "Capstone Project Report"
    ],
    "Business & Corporate": [
        "Business Proposal", "Business Plan", "Executive Summary", 
        "Investment Pitch", "Pitch Deck", "Market Analysis Report", 
        "Competitive Analysis Report", "Project Statement", "Project Charter", 
        "Product Requirements Document (PRD)", "Strategic Plan", 
        "Operational Plan", "Annual Report", "Internal Audit Report"
    ],
    "Finance & Funding": [
        "Grant Proposal", "Loan Application", "Funding Request Letter", 
        "Financial Projection Report", "Budget Proposal", "Procurement Proposal", 
        "Sponsorship Proposal"
    ],
    "Legal & Compliance": [
        "Contract Agreement", "Partnership Agreement", "Service Level Agreement (SLA)", 
        "Non-Disclosure Agreement (NDA)", "Terms & Conditions", "Privacy Policy", 
        "Data Processing Agreement (DPA)", "Memorandum of Understanding (MoU)", 
        "Memorandum (Internal Memo)", "Employment Agreement", "Consultancy Agreement", 
        "Licensing Agreement", "Shareholder Agreement", "Code of Conduct", 
        "Compliance Policy", "Risk Management Policy"
    ],
    "Government & Institutional": [
        "Policy Document", "Regulatory Submission", "Government Proposal", 
        "Public Notice", "Tender Submission", "Request for Proposal (RFP) Response", 
        "Standard Operating Procedure (SOP – Operational)", "Administrative Directive", 
        "Official Circular"
    ],
    "Startup & Product": [
        "Product Roadmap", "Investor Update", "Startup One-Pager", 
        "Go-to-Market Strategy", "Business Model Canvas", "Customer Acquisition Plan", 
        "Growth Strategy Document"
    ],
    "Specialized Academic": [
        "Conference Paper", "Journal Submission", "Abstract Submission", 
        "Poster Presentation Outline", "Ethics Approval Application", "IRB Application"
    ],
    "Comparisons": [
        "CV vs Resume", "White Paper vs Research Paper", "Business Proposal vs Grant Proposal",
        "Contract vs NDA", "Policy Document vs Terms & Conditions", 
        "Investment Pitch vs Business Plan", "SOP vs Personal Statement"
    ]
};

// 2. 🏗️ BLUEPRINT DEFINITIONS (Sample Scaffolding)
// In a full app, every item in the list above would have an entry here.
const BLUEPRINT_DETAILS = {
    "default": {
        sections: [
            { title: "Introduction", desc: "Context, background, and objectives." },
            { title: "Body / Analysis", desc: "Core content, data analysis, and arguments." },
            { title: "Conclusion", desc: "Summary of findings and next steps." }
        ],
        forbidden: ["Colloquial slang", "Unverified claims"],
        tone: "Professional"
    },
    "White Paper": {
        sections: [
            { title: "Executive Summary", desc: "High-level overview of the problem and solution." },
            { title: "Problem Statement", desc: "Detailed analysis of the current market gap." },
            { title: "Proposed Solution", desc: "Technical or strategic methodology." },
            { title: "Technical Architecture", desc: "Diagrams and specs of the implementation." },
            { title: "Conclusion", desc: "Final summary and call to action." }
        ],
        forbidden: ["First-person narration", "Marketing fluff"],
        tone: "Authoritative, Objective, Educational"
    },
    "Business Plan": {
        sections: [
            { title: "Executive Summary", desc: "The 'hook' for investors." },
            { title: "Company Overview", desc: "Mission, vision, and legal structure." },
            { title: "Market Analysis", desc: "TAM, SAM, SOM and competitor analysis." },
            { title: "Financial Projections", desc: "3-5 year P&L, balance sheet." }
        ],
        forbidden: ["Unrealistic growth curves", "Typos"],
        tone: "Persuasive, Realistic"
    }
};

// 3. ⚙️ APPLICATION LOGIC
class DocaApp {
    constructor() {
        this.ui = {
            sidebarMenu: document.getElementById('sidebar-menu'),
            mainView: document.getElementById('main-view'),
            sidebar: document.getElementById('sidebar'),
            overlay: document.getElementById('sidebar-overlay'),
            menuToggle: document.getElementById('menu-toggle'),
            docCount: document.getElementById('doc-count')
        };
        
        this.init();
    }

    init() {
        this.renderSidebar();
        this.renderLandingPage(); // Default State
        this.attachEvents();
    }

    // --- RENDERERS ---

    renderSidebar() {
        let html = '';
        let totalDocs = 0;

        for (const [category, docs] of Object.entries(DOCUMENT_LIBRARY)) {
            totalDocs += docs.length;
            const catId = category.replace(/\s+/g, '-').toLowerCase();
            
            html += `
                <div class="group mb-4">
                    <button class="w-full flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-brand-800 transition-colors"
                            onclick="document.getElementById('${catId}').classList.toggle('hidden'); this.querySelector('svg').classList.toggle('rotate-180')">
                        ${category}
                        <svg class="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <ul id="${catId}" class="mt-1 space-y-0.5 ${category === 'Core Professional' ? '' : 'hidden'}">
                        ${docs.map(doc => `
                            <li>
                                <button onclick="app.loadDocument('${doc}')" 
                                        class="doc-btn w-full text-left px-3 py-2 text-[13px] text-slate-600 rounded-md hover:bg-brand-50 hover:text-brand-900 transition-all border-l-2 border-transparent hover:border-brand-600 truncate">
                                    ${doc}
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        this.ui.sidebarMenu.innerHTML = html;
        this.ui.docCount.innerText = `${totalDocs} Types`;
    }

    renderLandingPage() {
        this.ui.mainView.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full min-h-[70vh] text-center animate-fade-in">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-2xl w-full">
                    <img src="assets/logo.png" alt="DOCA" class="h-16 w-16 mx-auto mb-4 object-contain" onerror="this.style.display='none'">
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Select a Document</h1>
                    <p class="text-slate-500 text-lg leading-relaxed">
                        Choose a document type from the sidebar to generate its compliance structure.
                        <br><span class="text-sm text-gray-400">Navigate through categorized folders to begin.</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-left">
                    <div class="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group">
                        <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </div>
                        <h3 class="font-bold text-slate-800 text-sm">Structural Integrity</h3>
                        <p class="text-xs text-slate-500 mt-1">Ensures all mandatory sections are included.</p>
                    </div>
                    <div class="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 class="font-bold text-slate-800 text-sm">Compliance Check</h3>
                        <p class="text-xs text-slate-500 mt-1">Validates against industry standards.</p>
                    </div>
                    <div class="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                        </div>
                        <h3 class="font-bold text-slate-800 text-sm">Format Export</h3>
                        <p class="text-xs text-slate-500 mt-1">Download skeletons in JSON or Markdown.</p>
                    </div>
                </div>
            </div>
        `;
    }

    loadDocument(docName) {
        // 1. Highlight Selection
        document.querySelectorAll('.doc-btn').forEach(b => {
            b.classList.remove('bg-brand-50', 'text-brand-900', 'border-brand-600', 'font-semibold');
        });
        const activeBtn = Array.from(document.querySelectorAll('.doc-btn')).find(b => b.textContent.trim() === docName);
        if(activeBtn) activeBtn.classList.add('bg-brand-50', 'text-brand-900', 'border-brand-600', 'font-semibold');

        // 2. Fetch Data (or fallback)
        const data = BLUEPRINT_DETAILS[docName] || BLUEPRINT_DETAILS["default"];
        const docId = "DOC-" + Math.floor(Math.random() * 10000);

        // 3. Render Document View
        this.ui.mainView.innerHTML = `
            <div class="w-full max-w-5xl animate-fade-in-up pb-20">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-200 pb-6 gap-4">
                    <div>
                        <span class="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-1 rounded mb-2 inline-block">ID: ${docId}</span>
                        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">${docName}</h1>
                        <p class="text-sm text-slate-500 mt-1">Status: <span class="text-orange-500 font-medium">Drafting (Structure Only)</span></p>
                    </div>
                    <div class="flex gap-3">
                        <button class="px-4 py-2 bg-white border border-slate-300 text-xs font-bold text-slate-700 uppercase tracking-wide rounded shadow-sm hover:bg-slate-50 transition-colors">
                            Copy Structure
                        </button>
                        <button class="px-4 py-2 bg-brand-900 text-white text-xs font-bold uppercase tracking-wide rounded shadow-md hover:bg-brand-800 hover:shadow-lg transition-all transform active:scale-95">
                            Export PDF
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Blueprint Sections</h3>
                                <span class="text-[10px] text-slate-400 font-mono">${data.sections.length} BLOCKS</span>
                            </div>
                            <div class="p-2">
                                <ul class="space-y-1">
                                    ${data.sections.map((sec, index) => `
                                        <li class="group flex gap-4 p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                                            <span class="text-2xl font-bold text-slate-200 group-hover:text-brand-200 font-mono">${String(index + 1).padStart(2, '0')}</span>
                                            <div>
                                                <h4 class="text-sm font-bold text-slate-800">${sec.title}</h4>
                                                <p class="text-xs text-slate-500 mt-1 leading-relaxed">${sec.desc}</p>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        
                        <div class="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div class="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>
                            <h4 class="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Required Tone</h4>
                            <p class="text-sm font-medium leading-relaxed">${data.tone}</p>
                        </div>

                        <div class="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                            <h4 class="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Strictly Forbidden</h4>
                            <ul class="space-y-2">
                                ${data.forbidden.map(item => `
                                    <li class="flex items-start gap-2 text-xs text-red-700 font-medium">
                                        <span class="text-red-400">&times;</span> ${item}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="p-4 rounded-xl border border-dashed border-slate-300 text-center">
                            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Last Updated</p>
                            <p class="text-xs font-mono text-slate-600 mt-1">${new Date().toLocaleDateString()}</p>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // 4. Mobile UX: Close Sidebar
        if (window.innerWidth < 768) {
            this.toggleSidebar();
        }
    }

    attachEvents() {
        this.ui.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.ui.overlay.addEventListener('click', () => this.toggleSidebar());
    }

    toggleSidebar() {
        this.ui.sidebar.classList.toggle('-translate-x-full');
        this.ui.overlay.classList.toggle('hidden');
    }
}

// Instantiate Global App
window.app = new DocaApp();