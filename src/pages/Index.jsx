import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Trash, Upload } from "lucide-react";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
  };

  const handleSave = () => {
    setIsEditing(null);
  };

  const handleDelete = (index) => {
    setCsvData(csvData.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Upload Section */}
      <div className="mb-4">
        <label htmlFor="csvUpload" className="flex items-center cursor-pointer">
          <Upload className="mr-2" />
          <span>Upload CSV</span>
        </label>
        <Input
          id="csvUpload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Data Display Section */}
      {csvData.length > 0 && (
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <TableCell key={colIndex}>
                      {isEditing === rowIndex ? (
                        <Input
                          value={row[header]}
                          onChange={(e) => {
                            const newData = [...csvData];
                            newData[rowIndex][header] = e.target.value;
                            setCsvData(newData);
                          }}
                        />
                      ) : (
                        row[header]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {isEditing === rowIndex ? (
                      <Button onClick={handleSave} className="mr-2">
                        <Save className="mr-2" />
                        Save
                      </Button>
                    ) : (
                      <Button onClick={() => handleEdit(rowIndex)} className="mr-2">
                        Edit
                      </Button>
                    )}
                    <Button onClick={() => handleDelete(rowIndex)} variant="destructive">
                      <Trash className="mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4">
            <Plus className="mr-2" />
            Add Row
          </Button>
        </div>
      )}

      {/* Download Section */}
      {csvData.length > 0 && (
        <div className="mt-4">
          <Button onClick={handleDownload}>
            <Save className="mr-2" />
            Download CSV
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;