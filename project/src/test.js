$(document).ready(function() {
	$('#example').dataTable( {
        scrollX:        true,
        fixedColumns: true

    } );
    
    var lastIdx = null;
    var table = $('#example').DataTable();
    new $.fn.dataTable.FixedColumns( table, {
        leftColumns: 1,
        rightColumns: 1
    } );
    $('#example tbody')
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index().column;
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        } );
} );