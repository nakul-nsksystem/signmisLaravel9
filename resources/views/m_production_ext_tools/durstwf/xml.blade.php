<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<HotfolderJob>
	
	<ProductionJob name="{{$params['name']}}" comment="" externalId="{{$params['externalId']}}" 
		leadIn="{{$params['leadIn']}}" 
		leadOut="{{$params['leadOut']}}" 
		shippingDate="{{$params['shippingDate']}}" 
		productionDate="{{$params['productionDate']}}" >
				    
		@if (isset($params['imposeTemplate']) && $params['imposeTemplate'] != "")
		<ImposeTemplate internalName="{{$params['imposeTemplate']}}" ></ImposeTemplate>
		@endif
		
		<!-- <Cutter internalName="FOTOBA_1">
				<CutterParameterSet internalName="FOTOBA_1_FOTOBA_DIGITRIM_SERIES_1"/>
		</Cutter> -->

				
		@foreach ($params['printItems'] as $pi)
			<PrintItem name="{{$pi['name']}}" comment="" 
				width="{{$pi['width']}}"
				height="{{$pi['height']}}" 
				unit="{{$pi['unit']}}" 
				pages="{{$pi['pages']}}" 
				numberOfCopies="{{$pi['numberOfCopies']}}" 
				url="{{$pi['url']}}" 
				windingType="{{$pi['windingType']}}" 
				orientation="{{$pi['orientation']}}">
			</PrintItem>
		@endforeach
		
		
	</ProductionJob>

</HotfolderJob>