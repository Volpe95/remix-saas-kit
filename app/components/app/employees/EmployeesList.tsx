import { useTranslation } from "react-i18next";
import Loading from "~/components/ui/loaders/Loading";

import { useState, useEffect } from "react";
import EmployeesListAndTable from "./EmployeesListAndTable";
import { Employee } from "@prisma/client";

interface Props {
  items: Employee[];
}
export default function EmployeesList({ items }: Props) {
  const { t } = useTranslation("translations");

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    const filtered = items.filter(
      (f) =>
        f.id?.toUpperCase().includes(searchInput.toUpperCase()) ||
        f.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.email?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );

    return filtered;
  };

  return (
    <div>
      {(() => {
        if (loading) {
          return <Loading />;
        } else {
          return (
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center justify-start w-full">
                    <div className="relative flex items-center w-full">
                      <div className="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="buscador"
                        id="buscador"
                        className="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder={t<string>("shared.searchDot")}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <EmployeesListAndTable items={filteredItems()} />
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}
