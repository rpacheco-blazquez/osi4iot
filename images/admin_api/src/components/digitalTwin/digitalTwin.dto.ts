import { IsNumber, IsString } from "class-validator";

class CreateDigitalTwinDto {
	@IsString()
	public digitalTwinUid: string;

	@IsString()
	public description: string;

	@IsString()
	public type: string;

	@IsString({each: true})
	public topicSensorTypes: string[];

	@IsNumber()
	public maxNumResFemFiles: number;

	@IsString()
	public digitalTwinSimulationFormat: string;
}

export default CreateDigitalTwinDto;