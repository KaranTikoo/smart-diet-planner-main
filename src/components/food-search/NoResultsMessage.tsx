
const NoResultsMessage = () => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">No foods found matching your criteria</p>
      <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
    </div>
  );
};

export default NoResultsMessage;
