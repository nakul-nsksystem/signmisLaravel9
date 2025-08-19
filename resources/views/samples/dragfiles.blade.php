@extends('layouts.app_aft_login')

@section('content')
<div class="p-4">
    <form method="POST" action="/upload" enctype="multipart/form-data">

    {{ csrf_field() }}

    <div id="dragarea" style="width:10rem;height:10rem;border:solid 1px black;"></div>
    <input type="file" id="file" name="file" class="form-control" multiple>

    <button type="submit">アップロード</button>

    </form>
</div>

@endsection

@section('scripts')
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script>
let a  = 2 ; 


jQuery(function() {
    $("#dragarea").on('dragover', (event) => {
        let oEvent = event.originalEvent ; 
        
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        oEvent.dataTransfer.dropEffect = 'copy';
    });

    $("#dragarea").on('drop', (event) => {
        let oEvent = event.originalEvent ; 
        event.stopPropagation();
        event.preventDefault();

        let dt = oEvent.dataTransfer ; 

        let files = dt.files;
        console.log(files);
    });

}) ; 

</script>
@endsection
