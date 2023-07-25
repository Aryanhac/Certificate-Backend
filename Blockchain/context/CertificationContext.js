const ContractJson = require("../artifacts/contracts/Certification.sol/Certification.json");

const abi = ContractJson.abi;
const API_KEY = process.env.API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const CertificationContext = React.createContext();

export const CertificationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // generate certificate
  const generateCertificate = async (cid, encryptIpfsLink) => {
    const alchemy = new hre.ethers.providers.AlchemyProvider("maticmum",API_KEY);
    const userWallet = new hre.ethers.Wallet(PRIVATE_KEY, alchemy);
    const Certification = new hre.ethers.Contract(CONTRACT_ADDRESS,abi,userWallet);

    // Write
    const tx = await Certification.addCertificate(cid, encryptIpfsLink); 

    setIsLoading(true);
    await tx.wait();
    setIsLoading(false);
  };

  // get certificate link
  const fetchCertificateLink = async (cid) => {
    const alchemy = new hre.ethers.providers.AlchemyProvider("maticmum",API_KEY);
    const userWallet = new hre.ethers.Wallet(PRIVATE_KEY, alchemy);
    const Certification = new hre.ethers.Contract(CONTRACT_ADDRESS,abi,userWallet);

    try {
      const certificateIpfsLink = await Certification.certificateExist(cid); // cid
      // console.log(certificateIpfsLink);

      // return decryptedUrl;
      return certificateIpfsLink;
    } catch (error) {
      return error.reason;
    }
  };
  
  return (
    <CertificationContext.Provider
      value={{
        generateCertificate,
        fetchCertificateLink,
        setIsLoading,
        isLoading,
      }}
    >
      {children}
    </CertificationContext.Provider>
  );
};
