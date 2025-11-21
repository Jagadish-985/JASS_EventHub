import { PageHeader } from '@/components/page-header';
import SuggestionForm from './suggestion-form';

export default function InviteSuggestionsPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Suggest Sections to Invite"
        description="Use AI to recommend which class sections to invite to your event for better attendance."
      />
      <SuggestionForm />
    </div>
  );
}
