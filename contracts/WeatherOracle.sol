// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WeatherOracle is Ownable {
    event WeatherRequested(bytes32 indexed requestId, string city, address indexed requester);
    event WeatherReported(bytes32 indexed requestId, string city, int256 temperature, string description, uint256 timestamp);

    struct WeatherReport {
        string city;
        int256 temperature;
        string description;
        uint256 timestamp;
    }

    mapping(bytes32 => WeatherReport) public weatherReports;
    mapping(bytes32 => string) public requestCities;

    address public oracle;
    bytes32 public jobId;
    uint256 public feeWei;

    constructor(address _oracle, address _owner, bytes32 _jobId) Ownable(_owner) {
        require(_oracle != address(0), "Oracle address cannot be zero");
        oracle = _oracle;
        jobId = _jobId;
        feeWei = 0.001 ether;
    }

    function requestWeather(string memory _city) public payable returns (bytes32 requestId) {
        require(bytes(_city).length > 0, "City cannot be empty");
        require(msg.value >= feeWei, "Insufficient payment for Chainlink request");
        require(oracle != address(0), "Oracle not configured");
        require(jobId != bytes32(0), "Job ID not configured");

        requestId = keccak256(abi.encodePacked(block.chainid, block.timestamp, msg.sender, _city));
        requestCities[requestId] = _city;

        emit WeatherRequested(requestId, _city, msg.sender);
    }

    function fulfill(bytes32 _requestId, string memory _weatherData) public {
        require(bytes(_weatherData).length > 0, "Weather data cannot be empty");

        (int256 temperature, string memory description) = parseWeatherData(_weatherData);
        string memory city = requestCities[_requestId];
        if (bytes(city).length == 0) {
            city = "Unknown";
        }

        weatherReports[_requestId] = WeatherReport({
            city: city,
            temperature: temperature,
            description: description,
            timestamp: block.timestamp
        });

        emit WeatherReported(_requestId, city, temperature, description, block.timestamp);
    }

    function setChainlinkOracle(address _oracle) public onlyOwner {
        require(_oracle != address(0), "Oracle address cannot be zero");
        oracle = _oracle;
    }

    function setJobId(bytes32 _jobId) public onlyOwner {
        require(_jobId != bytes32(0), "Job ID cannot be zero");
        jobId = _jobId;
    }

    function setFeeWei(uint256 _feeWei) public onlyOwner {
        feeWei = _feeWei;
    }

    function withdraw() public onlyOwner {
        (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
        require(sent, "Withdrawal failed");
    }

    function parseWeatherData(string memory _json) internal pure returns (int256 temperature, string memory description) {
        bytes memory json = bytes(_json);
        int256 parsedTemperature = 0;
        string memory parsedDescription = "";

        for (uint256 i = 0; i < json.length; i++) {
            if (json[i] != bytes1(0x22)) {
                continue;
            }

            uint256 keyStart = i + 1;
            uint256 keyEnd = keyStart;
            while (keyEnd < json.length && json[keyEnd] != bytes1(0x22)) {
                keyEnd++;
            }

            if (keyEnd >= json.length) {
                break;
            }

            bytes memory keyBytes = new bytes(keyEnd - keyStart);
            for (uint256 j = 0; j < keyBytes.length; j++) {
                keyBytes[j] = json[keyStart + j];
            }
            string memory key = string(keyBytes);

            uint256 valueStart = keyEnd + 1;
            while (valueStart < json.length && (json[valueStart] == bytes1(0x20) || json[valueStart] == bytes1(0x09) || json[valueStart] == bytes1(0x0a) || json[valueStart] == bytes1(0x0d) || json[valueStart] == bytes1(0x3a))) {
                valueStart++;
            }

            if (keccak256(abi.encodePacked(key)) == keccak256(abi.encodePacked("temperature"))) {
                uint256 valueEnd = valueStart;
                while (valueEnd < json.length && json[valueEnd] != bytes1(0x2c) && json[valueEnd] != bytes1(0x7d)) {
                    valueEnd++;
                }
                bytes memory valueBytes = new bytes(valueEnd - valueStart);
                for (uint256 k = 0; k < valueBytes.length; k++) {
                    valueBytes[k] = json[valueStart + k];
                }
                parsedTemperature = parseInt(string(valueBytes));
            } else if (keccak256(abi.encodePacked(key)) == keccak256(abi.encodePacked("description"))) {
                if (valueStart < json.length && json[valueStart] == bytes1(0x22)) {
                    uint256 valueEnd = valueStart + 1;
                    while (valueEnd < json.length && json[valueEnd] != bytes1(0x22)) {
                        valueEnd++;
                    }
                    if (valueEnd < json.length) {
                        bytes memory valueBytes = new bytes(valueEnd - (valueStart + 1));
                        for (uint256 k = 0; k < valueBytes.length; k++) {
                            valueBytes[k] = json[valueStart + 1 + k];
                        }
                        parsedDescription = string(valueBytes);
                    }
                }
            }

            i = keyEnd;
        }

        return (parsedTemperature, parsedDescription);
    }

    function parseInt(string memory value) internal pure returns (int256) {
        bytes memory b = bytes(value);
        int256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] == 0x2d) {
                return -result;
            } else if (b[i] >= 0x30 && b[i] <= 0x39) {
                result = result * 10 + int256(uint256(uint8(b[i]) - 0x30));
            } else if (b[i] == 0x2e) {
                break;
            }
        }
        return result;
    }
}
