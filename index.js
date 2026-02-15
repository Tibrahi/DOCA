const LANDING_HTML = `
    <div class="max-w-4xl mx-auto text-center mt-20 animate-fade-in">
        <h2 class="text-4xl font-bold text-slate-900 mb-4">Structure Before Substance</h2>
        <p class="text-gray-500 text-lg mb-12">Select a document from the classified sidebar to initialize a compliance-ready blueprint.</p>
        <div class="grid grid-cols-3 gap-6">
            <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 class="font-bold mb-2">Linear Flow</h4>
                <p class="text-xs text-gray-400">Validated structural sequencing for all professional documents.</p>
            </div>
            </div>
    </div>
`;

function showLanding() {
    document.getElementById('content-area').innerHTML = LANDING_HTML;
}

function loadDoc(title) {
    const content = document.getElementById('content-area');
    // Renders the document blueprint interface (clears landing info)
    content.innerHTML = `
        <div class="max-w-5xl mx-auto">
            <div class="flex justify-between items-end border-b border-gray-200 pb-6 mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900">${title}</h2>
                    <p class="text-sm text-indigo-600 font-medium">Compliance-Ready Blueprint</p>
                </div>
                <button class="bg-indigo-900 text-white px-6 py-2 rounded text-sm font-bold shadow-lg">Initialize Editor</button>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 bg-white p-8 rounded-lg border border-gray-200 min-h-[400px]">
                    <p class="text-gray-400 italic">Structural skeleton for ${title} will be generated here...</p>
                </div>
                <div class="space-y-6">
                    <div class="bg-slate-900 p-6 rounded-lg text-white">
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Compliance Level</h4>
                        <span class="text-2xl font-bold">STRICT</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initial Load
document.addEventListener('DOMContentLoaded', showLanding);