import { useState } from 'react';
import api from '../services/api';
import { Sparkles, Wand2, CheckCheck, Minimize2, Lightbulb, Tag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AIAssistant.css';

export default function AIAssistant({ content, title, onContentUpdate, onTitleSuggestions, onTagSuggestions }) {
  const [loading, setLoading] = useState(null); // tracks which action is loading

  const handleImprove = async (mode) => {
    if (!content || content === '<p></p>') {
      toast.error('Write some content first before using AI assist.');
      return;
    }

    setLoading(mode);
    try {
      if (mode === 'title') {
        const res = await api.post('/ai/improve', { content, mode: 'title' });
        const titles = JSON.parse(res.data.improved);
        onTitleSuggestions(titles);
        toast.success('Title suggestions generated!');
      } else {
        const res = await api.post('/ai/improve', { content, mode });
        onContentUpdate(res.data.improved);
        toast.success(`Content ${mode === 'grammar' ? 'grammar fixed' : mode === 'concise' ? 'made concise' : 'improved'}!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'AI service failed. Try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleSuggestTags = async () => {
    if (!content || content === '<p></p>') {
      toast.error('Write some content first before suggesting tags.');
      return;
    }

    setLoading('tags');
    try {
      const res = await api.post('/ai/suggest-tags', { content, title });
      onTagSuggestions(res.data.tags);
      toast.success('Tags suggested!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to suggest tags.');
    } finally {
      setLoading(null);
    }
  };

  const ButtonContent = ({ icon: Icon, label, mode }) => (
    <>
      {loading === mode ? <Loader2 size={16} className="spin" /> : <Icon size={16} />}
      <span>{loading === mode ? 'Processing...' : label}</span>
    </>
  );

  return (
    <div className="ai-assistant">
      <div className="ai-assistant-header">
        <Sparkles size={20} />
        <h3>AI Writing Assistant</h3>
      </div>

      <div className="ai-assistant-actions">
        <button
          className="ai-btn ai-btn-improve"
          onClick={() => handleImprove('improve')}
          disabled={loading !== null}
        >
          <ButtonContent icon={Wand2} label="Improve Writing" mode="improve" />
        </button>

        <button
          className="ai-btn ai-btn-grammar"
          onClick={() => handleImprove('grammar')}
          disabled={loading !== null}
        >
          <ButtonContent icon={CheckCheck} label="Fix Grammar" mode="grammar" />
        </button>

        <button
          className="ai-btn ai-btn-concise"
          onClick={() => handleImprove('concise')}
          disabled={loading !== null}
        >
          <ButtonContent icon={Minimize2} label="Make Concise" mode="concise" />
        </button>

        <button
          className="ai-btn ai-btn-title"
          onClick={() => handleImprove('title')}
          disabled={loading !== null}
        >
          <ButtonContent icon={Lightbulb} label="Suggest Titles" mode="title" />
        </button>

        <button
          className="ai-btn ai-btn-tags"
          onClick={handleSuggestTags}
          disabled={loading !== null}
        >
          <ButtonContent icon={Tag} label="Suggest Tags" mode="tags" />
        </button>
      </div>

      <p className="ai-assistant-note">
        Powered by Google Gemini AI
      </p>
    </div>
  );
}
