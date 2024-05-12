import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageOptions } from "../constants/Language";
import { Button } from "./components/ui/button";
import axios from "axios";

function App() {
  const [font, setFont] = useState("15px");
  const [Language, setLanguage] = useState(languageOptions[0].value);
  const [theme, setTheme] = useState("dark");
  const [status, setStatus] = useState();
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [outputDetails, setOutPutDetails] = useState("");

  console.log(languageOptions.find((f) => f.value == Language));

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: languageOptions.find((f) => f.value == Language).id,
      // encode source code in base64
      source_code: btoa(input),
      //stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "4acb8c3627msh52c071e0f2f02b6p10fae2jsn009c36756a2b",
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions" + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "4acb8c3627msh52c071e0f2f02b6p10fae2jsn009c36756a2b",
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutPutDetails(response.data);
        alert(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails.stdout) == "ée"
            ? "No Output"
            : atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };

  return (
    <>
      <div className="flex">
        <div className="w-[70%]">
          <div className="flex gap-6 p-4 border-b-4">
            <Select value={Language} onValueChange={(l) => setLanguage(l)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {languageOptions.map((l, index) => {
                    return (
                      <SelectItem key={index} value={l.value}>
                        {l.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={theme} onValueChange={(v) => setTheme(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Theme" />
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Theme</SelectLabel>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
            <Select value={font} onValueChange={(v) => setFont(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Font Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Size</SelectLabel>
                  <SelectItem value="12px">12px</SelectItem>
                  <SelectItem value="15px">15px</SelectItem>
                  <SelectItem value="20px">20px</SelectItem>
                  <SelectItem value="25px">25px</SelectItem>
                  <SelectItem value="30px">30px</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Editor
            handleInput={(data) => {
              setInput(data);
            }}
            font={font}
            Language={Language}
            theme={theme}
          />
        </div>
        <div className="border b-l-3 w-[30%]">
          <p className="font-bold text-center p-2">Code Execution</p>
          <div className="bg overflow-auto bg-black h-[30%] text-white p-2">
            {outputDetails ? <>{getOutput(outputDetails)}</> : null}
          </div>
          <div className="flex justify-center items-center p-3">
            <Button disabled={processing} onClick={() => handleCompile()}>
              {processing ? "Please Wait..." : "Run"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
