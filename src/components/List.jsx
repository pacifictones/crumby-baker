import PropTypes from "prop-types";

const List = ({ data, renderItem }) => {
  if (!data || data.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
      {data.map((item) => renderItem(item))}
    </div>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
};

export default List;
