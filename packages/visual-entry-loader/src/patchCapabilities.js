module.exports = function(capabilities) {
	if (capabilities.objects) {
		var objects = capabilities.objects
		for (var objectKey in objects) {
			if (objects.hasOwnProperty(objectKey)) {
				var properties = objects[objectKey].properties
				if (properties) {
					for (var propertyKey in properties) {
						if (properties.hasOwnProperty(propertyKey)) {
							var property = properties[propertyKey]
							if (property.type && property.type.enumeration) {
								property.type.enumeration = powerbi.createEnumType(
									property.type.enumeration
								)
							}
						}
					}
				}
			}
		}
	}

	return capabilities
}
