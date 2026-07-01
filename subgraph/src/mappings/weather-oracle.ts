import { WeatherReported } from '../../generated/WeatherOracle/WeatherOracle';
import { WeatherReport } from '../../generated/schema';

export function handleWeatherReported(event: WeatherReported): void {
  let entity = WeatherReport.load(event.params.requestId.toHexString());
  if (!entity) {
    entity = new WeatherReport(event.params.requestId.toHexString());
  }

  entity.city = event.params.city;
  entity.temperature = event.params.temperature.toI32();
  entity.description = event.params.description;
  entity.timestamp = event.params.timestamp;
  entity.requester = event.transaction.from;
  entity.save();
}
