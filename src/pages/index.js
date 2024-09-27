export async function getServerSideProps() {
  try {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const data = await resp.json();

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}

import { useState } from "react";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersPage({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "desc") {
      return b.name.localeCompare(a.name);
    } else {
      return 0;
    }
  });

  const filteredData = sortedData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-300 p-4 min-h-screen">
      <div className="bg-white rounded-lg py-4 px-6">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-2xl font-bold">Users Data</h1>
        </div>
        <div className="flex items-center gap-4 my-4">
          <Input
            className="w-full"
            placeholder="Search (enter name or username)"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Default</SelectItem>
              <SelectItem value="asc">Sort by Name (Asc)</SelectItem>
              <SelectItem value="desc">Sort by Name (Desc)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {data.length === 0 ? (
            <div className="my-5">
              <Loading />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="rounded-tl-lg">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="rounded-tr-lg">Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.website}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Pagination className="flex justify-end mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
