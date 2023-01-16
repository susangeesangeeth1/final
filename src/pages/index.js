import { useEffect, useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import {
  Flex,
  Text,
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { InputForm } from "../../src/components/Input";
import api from "../../src/services/api";
import swal from "sweetalert";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import LOGO2 from "../assets/LOGO2.jpg";
export default function Home({ clients: fetchedClients }) {
  const toast = useToast();

  const [clients, setClients] = useState(fetchedClients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("Scan...");
  const [errors, setErrors] = useState({ name: null, email: null });

  const isValidFormData = () => {
    if (!name) {
      setErrors({ name: "Name is required" });
      return false;
    }

    if (!email) {
      setErrors({ email: "Rs is required" });
      return false;
    }

    //if (clients.some((client) => client.email === email && client._id !== id)) {
    // setErrors({ email: "Email already in use" });
    //return;
    //}

    // setErrors({});
    return true;
  };

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if (!isValidFormData()) return;

    try {
      setIsLoading(true);
      const { data } = await api.post("/clients", { name, email });

      setClients(clients.concat(data.data));

      setName("");
      setEmail("");
      toggleFormState();
      setIsLoading(false);

      swal({
        title: "Successfuly Added",
        icon: "success",
        dangerMode: true,
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleSubmitUpdateClient = async (e) => {
    e.preventDefault();

    if (!isValidFormData()) return;

    try {
      setIsLoading(true);

      await api.put(`/clients/${id}`, { name, email });
      setClients(
        clients.map((client) =>
          client._id === id ? { name, email, _id: id } : client
        )
      );

      setName("");
      setEmail("");
      setId(null);
      toggleFormState();
      setIsLoading(false);

      swal({
        title: "Successfuly Updated",
        icon: "success",
        dangerMode: true,
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`/clients/${_id}`);
      setClients(clients.filter((client) => client._id !== _id));
    } catch (err) {
      console.log(err);
    }

    swal({
      title: "Successfuly Deleted",
      icon: "success",
      dangerMode: true,
    });
  };

  const handleChangeName = (text) => {
    setName(text);
  };

  const handleChangeEmail = (text) => {
    setEmail(text);
  };

  const handleShowUpdateClientForm = (client) => {
    setId(client._id);
    setName(client.name);
    setEmail(client.email);
    setIsFormOpen(true);
  };

  const toggleFormState = () => {
    setIsFormOpen(!isFormOpen);
  };

  // useEffect(() => {
  //   api.get('/clients').then(({data}) => {
  //     setClients(data.data)
  //   })
  // }, [])

  return (
    <div>
      <Image src={LOGO2} alt="music" />
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
        // open the front camera
        constraints={{ facingMode: "environment" }}
        style={{ width: "30%", height: "30%" }}
      />
      <Box margin="10">
        <VStack
          marginY="1rem"
          as="form"
          onSubmit={id ? handleSubmitUpdateClient : handleSubmitCreateClient}
        >
          <InputForm
            placeholder="Name"
            name="value"
            value={data}
            onChange={(event) => handleChangeName(event.target.value)}
            //error={errors.name}
          />

          <InputForm
            placeholder="Rs"
            name="email"
            type="number"
            value={email}
            onChange={(e) => handleChangeEmail(e.target.value)}
            error={errors.email}
          />

          <Button
            fontSize="lg"
            alignSelf="center"
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
          >
            {id ? "Atualizar" : "Add"}
          </Button>
        </VStack>

        <Table variant="simple" my="10">
          <Thead bgColor="blue.500">
            <Tr>
              <Th textColor="white">Name</Th>
              <Th textColor="white">Rs.</Th>
              <Th textColor="white">Date</Th>
              <Th textColor="white">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.email}>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td>{client.createdAt}</Td>
                <Td>
                  <Flex justifyContent="space-between">
                    <Button
                      size="sm"
                      fontSize="smaller"
                      colorScheme="yellow"
                      mr="1"
                      onClick={() => handleShowUpdateClientForm(client)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      fontSize="smaller"
                      colorScheme="red"
                      onClick={() => handleDeleteClient(client._id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <p align="center">Web App @ Dinith Dissanayaka</p>
        <p align="center">&copy; 2022</p>
      </Box>
    </div>
  );
}

export const getServerSideProps = async () => {
  try {
    const { data } = await api.get("/clients");

    return {
      props: {
        clients: data.data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
};
