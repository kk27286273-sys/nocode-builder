export const ViewerManager = ({ data }: ViewerManagerProps) => {
  switch (data.templateType) {
    case 'corporate':
      return <CorporateViewer data={data} />;
    case 'rental-shop':
      return <RentalViewer data={data} />;
    case 'portfolio':
      return <PortfolioViewer data={data} />;
    case 'legal':
      return <LegalViewer data={data} />;
    case 'fitness':
      return <FitnessViewer data={data} />;
    case 'one-page':
    default:
      return <OnePageViewer data={data} />;
  }
};