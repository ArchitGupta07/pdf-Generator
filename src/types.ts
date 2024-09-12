type TableColumnValue = {
  [key: string]: "subhead" | "checkbox" | string;
};

type TableColumn = TableColumnValue[];

interface Table {
  [columnName: string]: TableColumn;
}
interface Column {
  [columnName: string]: TableColumn;
}

interface TableData {
  [tableName: string]: Table;
}
