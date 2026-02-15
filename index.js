/**
 * DOCA - Document Oriented Compliance Architecture
 * Core Logic & Blueprint Schema
 * * Philosophy: 
 * 1. Data drives the UI.
 * 2. No heavy frameworks.
 * 3. Instant interactions.
 */

// 🏛️ 1. THE DATA LAYER (Blueprint Schema)
// This is the "brain" of the application. It defines the structure of every document.
const DOC_BLUEPRINTS = {
    "white-paper": {
        title: "White Paper",
        id: "DOC-WP-101",
        category: "Core Professional",
        sections: [
            { id: 1, title: "Executive Summary", required: true, desc: "High-level overview of the problem and solution." },
            { id: 2, title: "Problem Statement", required: true, desc: "Detailed analysis of the current market gap or technical issue." },
            { id: 3, title: "Proposed Solution", required: true, desc: "Technical or strategic methodology to solve the problem." },
            { id: 4, title: "Technical Architecture", required: false, desc: "Diagrams and specs of the implementation." },
            { id: 5, title: "Conclusion", required: true, desc: "Final summary and call to action." }
        ],
        forbidden: ["First-person narration ('I think')", "Uncited statistics", "Marketing fluff"],
        tone: "Authoritative, Objective, Educational"
    },
    "business-plan": {
        title: "Business Plan",
        id: "DOC-BP-204",
        category: "Business & Corporate",
        sections: [
            { id: 1, title: "Executive Summary", required: true, desc: "The 'hook' for investors." },
            { id: 2, title: "Company Overview", required: true, desc: "Mission, vision, and legal structure." },
            { id: 3, title: "Market Analysis", required: true, desc: "TAM, SAM, SOM and competitor analysis." },
            { id: 4, title: "Operational Plan", required: true, desc: "Logistics, location, and facilities." },
            { id: 5, title: "Financial Projections", required: true, desc: "3-5 year P&L, balance sheet, cash flow." }
        ],
        forbidden: ["Unrealistic growth curves", "Vague distinct competencies", "Typos"],
        tone: "Persuasive, Realistic, Data-Driven"
    },
    "contract-agreement": {
        title: "Service Level Agreement (SLA)",
        id: "DOC-LEG-502",
        category: "Legal & Compliance",
        sections: [
            { id: 1, title: "Parties Involved", required: true, desc: "Legal names and addresses of Service Provider and Client." },
            { id: 2, title: "Scope of Services", required: true, desc: "Explicit definition of what is included (and excluded)." },
            { id: 3, title: "Performance Metrics", required: true, desc: "Uptime guarantees, response times, and KPIs." },
            { id: 4, title: "Remedies & Penalties", required: true, desc: "Consequences for failure to meet metrics." },
            { id: 5, title: "Termination Clause", required: true, desc: "Conditions under which the agreement ends." }
        ],
        forbidden: ["Ambiguous timelines ('soon')", "Handshake agreements", "Undefined technical jargon"],
        tone: "Strict, Precise, Binding"
    }
    // Add more blueprints here...
};

// ⚙️ 2. THE VIEW ENGINE (Logic)
class DocaApp {
    constructor() {
        // Cache DOM elements for performance
        this.ui = {
            sidebar: document.getElementById('sidebar'),
            overlay: document.getElementById('sidebar-overlay'),
            mainView: document.getElementById('main-view'),
            sidebarList: document.getElementById('sidebar-list-container'), // Ensure your ULs are inside this
            navTitle: document.querySelector('nav h1')
        };
        
        this.state = {
            activeDoc: null,
            isMobile: window.innerWidth < 768
        };

        this.init();
    }

    init() {
        this.attachGlobalListeners();
        console.log("DOCA System: Online");
    }

    attachGlobalListeners() {
        // Event Delegation for Sidebar:
        // Instead of adding listeners to every <li>, we listen to the parent container.
        // This improves memory usage significantly.
        document.body.addEventListener('click', (e) => {
            
            // Handle Document Selection
            if (e.target.closest('[data-doc-type]')) {
                const btn = e.target.closest('[data-doc-type]');
                const docType = btn.getAttribute('data-doc-type');
                this.handleDocSelection(docType, btn);
            }

            // Handle Sidebar Toggles (Mobile)
            if (e.target.closest('#menu-toggle') || e.target.id === 'sidebar-overlay') {
                this.toggleSidebar();
            }

            // Handle Group Toggles (Accordion)
            if (e.target.closest('[data-accordion-trigger]')) {
                const trigger = e.target.closest('[data-accordion-trigger]');
                this.toggleAccordion(trigger);
            }
        });

        // Responsive Check
        window.addEventListener('resize', () => {
            this.state.isMobile = window.innerWidth < 768;
            if (!this.state.isMobile) {
                // Reset sidebar styles on desktop
                this.ui.sidebar.classList.remove('-translate-x-full');
                this.ui.overlay.classList.add('hidden');
            } else {
                this.ui.sidebar.classList.add('-translate-x-full');
            }
        });
    }

    toggleSidebar() {
        const isClosed = this.ui.sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            this.ui.sidebar.classList.remove('-translate-x-full');
            this.ui.overlay.classList.remove('hidden');
        } else {
            this.ui.sidebar.classList.add('-translate-x-full');
            this.ui.overlay.classList.add('hidden');
        }
    }

    toggleAccordion(triggerElement) {
        const targetId = triggerElement.getAttribute('data-target');
        const targetList = document.getElementById(targetId);
        
        // Simple toggle logic
        if (targetList) {
            targetList.classList.toggle('hidden');
            // Optional: Rotate an arrow icon here if you added one
        }
    }

    handleDocSelection(docKey, btnElement) {
        // 1. UI Feedback (Active State)
        document.querySelectorAll('[data-doc-type]').forEach(el => {
            el.classList.remove('bg-indigo-50', 'text-indigo-900', 'border-l-4', 'border-indigo-800', 'font-semibold');
            el.classList.add('text-gray-600');
        });
        
        btnElement.classList.remove('text-gray-600');
        btnElement.classList.add('bg-indigo-50', 'text-indigo-900', 'border-l-4', 'border-indigo-800', 'font-semibold');

        // 2. Fetch Data
        const data = DOC_BLUEPRINTS[docKey];

        // 3. Render View
        if (data) {
            this.renderBlueprint(data);
        } else {
            // Fallback for items not yet in JSON
            this.renderPlaceholder(btnElement.innerText);
        }

        // 4. Close Mobile Sidebar
        if (this.state.isMobile) this.toggleSidebar();
    }

    renderBlueprint(data) {
        // Performance: Build the HTML string first, then inject once.
        // This avoids multiple Reflows/Repaints.
        
        const sectionsHtml = data.sections.map(sec => `
            <li class="group flex items-start gap-3 p-3 bg-slate-50 border-l-[3px] ${sec.required ? 'border-indigo-600' : 'border-gray-300'} hover:bg-white hover:shadow-sm transition-all duration-200">
                <span class="text-xs font-mono text-gray-400 mt-0.5">${String(sec.id).padStart(2, '0')}.</span>
                <div>
                    <span class="text-sm font-semibold text-slate-800 block">${sec.title} ${sec.required ? '<span class="text-[10px] text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded ml-2 uppercase tracking-wide">Req</span>' : ''}</span>
                    <span class="text-xs text-gray-500 mt-1 block">${sec.desc}</span>
                </div>
            </li>
        `).join('');

        const forbiddenHtml = data.forbidden.map(item => `
            <li class="flex items-start gap-2 text-sm text-red-700/80">
                <span class="font-bold">&times;</span> ${item}
            </li>
        `).join('');

        const template = `
            <div class="w-full max-w-5xl animate-fade-in mx-auto">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-200 pb-6 gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h2 class="text-3xl font-bold text-slate-900 tracking-tight">${data.title}</h2>
                            <span class="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">${data.id}</span>
                        </div>
                        <p class="text-sm text-gray-500">Category: <span class="font-medium text-indigo-900">${data.category}</span></p>
                    </div>
                    <div class="flex gap-3">
                        <button class="px-5 py-2.5 bg-white border border-gray-300 text-xs font-bold text-gray-700 uppercase tracking-wide rounded hover:bg-gray-50 transition-colors shadow-sm">
                            Export JSON
                        </button>
                        <button class="px-5 py-2.5 bg-indigo-900 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-indigo-800 transition-colors shadow-md hover:shadow-lg">
                            Initialize Doc
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div class="lg:col-span-8 space-y-6">
                        <div class="bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Structural Sequence</h4>
                                <span class="text-[10px] text-gray-400 font-mono">FLOW: LINEAR</span>
                            </div>
                            <ul class="p-4 space-y-2">
                                ${sectionsHtml}
                            </ul>
                        </div>
                    </div>

                    <div class="lg:col-span-4 space-y-6">
                        
                        <div class="bg-indigo-50/80 p-6 rounded-lg border border-indigo-100">
                            <h4 class="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Tone Calibration
                            </h4>
                            <p class="text-sm text-indigo-900 leading-relaxed font-medium">
                                ${data.tone}
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-lg border border-red-100 shadow-sm">
                            <h4 class="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Compliance Violations</h4>
                            <ul class="space-y-3">
                                ${forbiddenHtml}
                            </ul>
                        </div>

                        <div class="bg-slate-800 p-6 rounded-lg text-white shadow-lg">
                             <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Validation Level</h4>
                             <div class="flex items-end gap-2">
                                <span class="text-3xl font-bold">Strict</span>
                             </div>
                             <p class="text-xs text-slate-400 mt-2">Any deviation from the required structure will be flagged during export.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.ui.mainView.innerHTML = template;
    }

    renderPlaceholder(title) {
        this.ui.mainView.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div class="p-4 bg-gray-100 rounded-full mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h2 class="text-xl font-bold text-gray-700">${title}</h2>
                <p class="text-gray-500 mt-2">Blueprint definition not found in local schema.</p>
                <p class="text-xs text-gray-400 mt-1 font-mono">Error: BLUEPRINT_MISSING_JSON</p>
            </div>
        `;
    }
}

// 🚀 Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const app = new DocaApp();
});