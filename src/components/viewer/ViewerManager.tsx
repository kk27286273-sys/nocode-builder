import { CorporateViewer } from '@/components/builder/CorporateViewer';
import InteriorViewer from '@/components/viewer/templates/InteriorViewer';
import LegalViewer from '@/components/viewer/templates/LegalViewer';
import FitnessViewer from '@/components/viewer/templates/FitnessViewer';

export function ViewerManager({
  templateType,
  data,
}: {
  templateType: string;
  data: any;
}) {
  switch (templateType) {
    case 'corporate':
      return <CorporateViewer data={data} />;
    case 'interior':
      return <InteriorViewer data={data} />;
    case 'legal':
      return <LegalViewer data={data} />;
    case 'fitness':
      return <FitnessViewer data={data} />;
    default:
      return <CorporateViewer data={data} />;
  }
}