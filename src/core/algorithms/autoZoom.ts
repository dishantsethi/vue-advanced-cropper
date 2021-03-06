import { applyMove, applyScale, fit, inverseMove, maxScale, toLimits } from '../service';
import { Coordinates, AreaRestrictions, VisibleArea } from '../typings';

// The main point of this feature is calculating the needed position of stencil and parameters of world transforms
// Real coordinates don't changes here
interface AutoZoomParams {
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	areaRestrictions: AreaRestrictions;
}
interface AutoZoomResult {
	visibleArea: VisibleArea;
}
export function autoZoom(params: AutoZoomParams): AutoZoomResult {
	const { coordinates: originalCoordinates, visibleArea: originalVisibleArea, areaRestrictions } = params;

	let visibleArea = { ...originalVisibleArea };
	const coordinates = { ...originalCoordinates };

	const widthIntersections = Math.max(0, coordinates.width - visibleArea.width);
	const heightIntersections = Math.max(0, coordinates.height - visibleArea.height);

	if (widthIntersections > heightIntersections) {
		visibleArea = applyScale(
			visibleArea,
			Math.min(coordinates.width / visibleArea.width, maxScale(visibleArea, areaRestrictions)),
		);
	} else if (heightIntersections > widthIntersections) {
		visibleArea = applyScale(
			visibleArea,
			Math.min(coordinates.height / visibleArea.height, maxScale(visibleArea, areaRestrictions)),
		);
	}

	visibleArea = applyMove(visibleArea, inverseMove(fit(coordinates, toLimits(visibleArea))));

	visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

	return {
		visibleArea,
	};
}
