import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { FeeStructure } from "../../types/financials.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreateFeeStructureForm from "../../components/admin/CreateFeeStructureForm";

export default function ManageFinancesPage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFeeStructures = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/financials/fee-structures");
      setFeeStructures(response.data);
    } catch (err) {
      console.error("Failed to fetch fee structures", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const handleCreationSuccess = () => {
    setIsModalOpen(false);
    fetchFeeStructures();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Financial Management
        </h1>
      </div>

      {/* Fee Structures Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Fee Structures
          </h2>
          <Button onClick={() => setIsModalOpen(true)} className="w-auto">
            Add New Fee
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                feeStructures.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {fee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {fee.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      ${Number(fee.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Fee Structure"
      >
        <CreateFeeStructureForm onSuccess={handleCreationSuccess} />
      </Modal>
    </div>
  );
}
