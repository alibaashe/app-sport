import { useState, FormEvent } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function Support() {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, email, description })
      });
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, errors: [err.message] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Contact Support</h1>
        <p className="text-sm text-gray-500">
          This form will automatically create an activity in <span className="font-bold text-white">Pipedrive</span> and a support ticket in <span className="font-bold text-white">Zendesk</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#161821] border border-[#242731] p-6 rounded-2xl space-y-6">
        <div className="space-y-4">
          <div>
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
             <input 
               type="email" 
               required
               value={email}
               onChange={e => setEmail(e.target.value)}
               className="w-full bg-[#0A0B0E] border border-[#2D313E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
               placeholder="you@example.com"
             />
          </div>
          <div>
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
             <input 
               type="text" 
               required
               value={subject}
               onChange={e => setSubject(e.target.value)}
               className="w-full bg-[#0A0B0E] border border-[#2D313E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
               placeholder="Issue Title"
             />
          </div>
          <div>
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
             <textarea 
               required
               rows={4}
               value={description}
               onChange={e => setDescription(e.target.value)}
               className="w-full bg-[#0A0B0E] border border-[#2D313E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors resize-none"
               placeholder="Please describe your issue..."
             />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 transition-all rounded-xl font-bold text-white shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Ticket
            </>
          )}
        </button>

        {result && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 mt-6 ${result.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <div className="flex items-start gap-3">
               {result.success ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
               <div className="text-sm">
                  <p className="font-bold mb-1">{result.success ? 'Integrations triggered successfully!' : 'Partial or complete failure'}</p>
                  
                  {result.errors && result.errors.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-xs opacity-80 mt-2">
                       {result.errors.map((err: string, i: number) => (
                         <li key={i}>{err}</li>
                       ))}
                    </ul>
                  )}
               </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
