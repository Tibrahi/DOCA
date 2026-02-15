/**
 * DOCA v2.1 - Modern Logic
 * Handles dynamic menu generation, animations, and SPA routing.
 */

// 1. 📂 THE DATA STRUCTURE
const DOCUMENT_LIBRARY = {
    "Core Professional": [
        "White Paper", "Research Paper", "Technical Report", "Case Study", 
        "Literature Review", "System Design Document", "Feasibility Study", 
        "Impact Assessment Report", "Policy Brief"
    ],
    "Career & Academic": [
        "CV (Curriculum Vitae)", "Resume", "Statement of Purpose", 
        "Personal Statement", "Letter of Intent", "Motivation Letter", 
        "Cover Letter", "Academic Portfolio", "Research Proposal", 
        "Thesis Proposal", "Dissertation", "Capstone Project"
    ],
    "Business & Corporate": [
        "Business Proposal", "Business Plan", "Executive Summary", 
        "Investment Pitch", "Pitch Deck", "Market Analysis", 
        "Project Charter", "Product Requirements (PRD)", "Strategic Plan", 
        "Operational Plan", "Annual Report"
    ],
    "Finance & Funding": [
        "Grant Proposal", "Loan Application", "Funding Request", 
        "Financial Projection", "Budget Proposal", "Procurement Proposal"
    ],
    "Legal & Compliance": [
        "Contract Agreement", "Partnership Agreement", "SLA (Service Level)", 
        "NDA (Non-Disclosure)", "Terms & Conditions", "Privacy Policy", 
        "DPA (Data Processing)", "MOU (Memorandum)", "Employment Agreement"
    ],
    "Startup & Product": [
        "Product Roadmap", "Investor Update", "Startup One-Pager", 
        "Go-to-Market Strategy", "Business Model Canvas", "Growth Strategy"
    ]
};

// 2. 🏗️ BLUEPRINT DEFINITIONS
const BLUEPRINT_DETAILS = {
    "default": {
        sections: [
            { title: "Introduction", desc: "Sets the context, background, and core objectives." },
            { title: "Strategic Analysis", desc: "Data-driven body content with evidence." },
            { title: "Implementation Plan", desc: "Steps, timeline, and resource allocation." },
            { title: "Conclusion", desc: "Summary of findings and call to action." }
        ],
        forbidden: ["Colloquial slang", "Unverified claims", "Ambiguous timelines"],
        tone: "Professional & Objective"
    },
    "White Paper": {
        sections: [
            { title: "Executive Summary", desc: "High-level overview of the problem and solution." },
            { title: "Problem Statement", desc: "Detailed analysis of the current market gap." },
            { title: "Proposed Solution", desc: "Technical or strategic methodology." },
            { title: "Technical Architecture", desc: "Diagrams and specs of the implementation." },
            { title: "Conclusion", desc: "Final summary and call to action." }
        ],
        forbidden: ["First-person narration", "Marketing fluff", "Uncited statistics"],
        tone: "Authoritative, Educational"
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
        this.renderLandingPage();
        this.attachEvents();
    }

    renderSidebar() {
        let html = '';
        let totalDocs = 0;

        for (const [category, docs] of Object.entries(DOCUMENT_LIBRARY)) {
            totalDocs += docs.length;
            const catId = category.replace(/\s+/g, '-').replace(/[&]/g, '').toLowerCase();
            
            html += `
                <div class="group mb-2">
                    <button class="w-full flex items-center justify-between px-2 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors rounded-lg hover:bg-slate-50/50"
                            onclick="app.toggleCategory('${catId}', this)">
                        ${category}
                        <svg class="w-3 h-3 transition-transform duration-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <ul id="${catId}" class="mt-1 space-y-1 overflow-hidden transition-all duration-300 ${category === 'Core Professional' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}">
                        ${docs.map((doc, index) => `
                            <li style="animation-delay: ${index * 30}ms" class="${category === 'Core Professional' ? 'animate-slide-in' : ''}">
                                <button onclick="app.loadDocument('${doc}')" 
                                        class="doc-btn w-full text-left px-3 py-2 text-[13px] text-slate-600 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent hover:border-brand-100 truncate flex items-center gap-2 group-btn">
                                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 group-btn-hover:bg-brand-400 transition-colors"></span>
                                    ${doc}
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        this.ui.sidebarMenu.innerHTML = html;
        this.ui.docCount.innerText = `${totalDocs}`;
    }

    toggleCategory(id, btn) {
        const list = document.getElementById(id);
        const icon = btn.querySelector('svg');
        
        if (list.classList.contains('max-h-0')) {
            list.classList.remove('max-h-0', 'opacity-0');
            list.classList.add('max-h-[1000px]', 'opacity-100');
            icon.classList.add('rotate-180');
            
            // Add animation classes to children when opened
            Array.from(list.children).forEach((li, idx) => {
                li.style.animationDelay = `${idx * 30}ms`;
                li.classList.add('animate-slide-in');
            });
        } else {
            list.classList.add('max-h-0', 'opacity-0');
            list.classList.remove('max-h-[1000px]', 'opacity-100');
            icon.classList.remove('rotate-180');
        }
    }

    renderLandingPage() {
        this.ui.mainView.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full min-h-[70vh] text-center animate-fade-in-up">
                
                <div class="relative mb-8 group cursor-default">
                    <div class="absolute -inset-1 bg-gradient-to-r from-brand-400 to-blue-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div class="relative bg-white rounded-full p-6 shadow-xl ring-1 ring-gray-900/5">
                        <img src="assets/logo.png" alt="DOCA" class="h-16 w-16 object-contain" onerror="this.style.display='none'">
                    </div>
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                    Structure Before <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">Substance</span>
                </h1>
                
                <p class="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                    Select a standardized document format from the library to generate a compliant architectural blueprint.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl text-left">
                    ${this.makeCard('Structural Validation', 'Ensure mandatory sections are present.', 'blue')}
                    ${this.makeCard('Compliance Mapping', 'Adhere to institutional formatting.', 'teal')}
                    ${this.makeCard('Blueprint Export', 'Download JSON or Markdown skeletons.', 'indigo')}
                </div>
            </div>
        `;
    }

    makeCard(title, desc, color) {
        return `
            <div class="p-6 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <div class="w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="font-bold text-slate-800 text-sm mb-1">${title}</h3>
                <p class="text-xs text-slate-500 leading-relaxed">${desc}</p>
            </div>
        `;
    }

    loadDocument(docName) {
        // UI Highlight Logic
        document.querySelectorAll('.doc-btn').forEach(b => {
            b.classList.remove('bg-brand-50', 'text-brand-700', 'shadow-sm', 'ring-1', 'ring-brand-200');
            b.querySelector('span').classList.remove('bg-brand-500');
            b.querySelector('span').classList.add('bg-slate-300');
        });
        
        const activeBtn = Array.from(document.querySelectorAll('.doc-btn')).find(b => b.textContent.trim() === docName);
        if(activeBtn) {
            activeBtn.classList.add('bg-brand-50', 'text-brand-700', 'shadow-sm', 'ring-1', 'ring-brand-200');
            activeBtn.querySelector('span').classList.remove('bg-slate-300');
            activeBtn.querySelector('span').classList.add('bg-brand-500');
        }

        // Data Fetch
        const data = BLUEPRINT_DETAILS[docName] || BLUEPRINT_DETAILS["default"];
        const docId = "DOC-" + Math.floor(Math.random() * 9000 + 1000);

        // View Render
        this.ui.mainView.innerHTML = `
            <div class="w-full max-w-5xl animate-fade-in-up pb-20">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200/60 gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">${docName}</h1>
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">${docId}</span>
                        </div>
                        <p class="text-sm text-slate-500">Compliance Mode: <span class="text-brand-600 font-semibold">Strict</span></p>
                    </div>
                    <div class="flex gap-3">
                        <button class="px-5 py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all">
                            Copy JSON
                        </button>
                        <button class="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Export PDF
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div class="lg:col-span-8">
                        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center backdrop-blur-md">
                                <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Structural Sequence</h3>
                            </div>
                            <div class="p-2 space-y-1">
                                ${data.sections.map((sec, index) => `
                                    <div class="group flex gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default">
                                        <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 font-mono text-sm font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                            ${index + 1}
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-bold text-slate-800 group-hover:text-brand-700 transition-colors">${sec.title}</h4>
                                            <p class="text-xs text-slate-500 mt-1">${sec.desc}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-4 space-y-5">
                        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tone Calibration</h4>
                            <p class="text-sm font-medium leading-relaxed opacity-90">${data.tone}</p>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8"></div>
                            <h4 class="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Forbidden Elements</h4>
                            <ul class="space-y-2.5">
                                ${data.forbidden.map(item => `
                                    <li class="flex items-center gap-2.5 text-xs text-slate-600">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> ${item}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (window.innerWidth < 768) this.toggleSidebar();
    }

    toggleSidebar() {
        this.ui.sidebar.classList.toggle('-translate-x-full');
        this.ui.overlay.classList.toggle('hidden');
    }
}

// Instantiate
window.app = new DocaApp();