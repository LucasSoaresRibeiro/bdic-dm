<div class="alert alert-success">
Relatório gerado com Sucesso!
</div>
<table class="table table-striped table-hover table-condensed">
  <thead>
    <tr>
      <h5>Total de transações status "<?php echo $_REQUEST["status"]; ?>": <?php echo $count[0]["count"]; ?></h5>
      <h5>Exibindo: <?php echo count($rowsSelect); ?></h5>
      </td>
    </tr>
    <tr>
      <td>User Token</td>
      <td>Data</td>
      <td>Latitude</td>
      <td>Longitude</td>
    </tr>
  </thead>
  <tbody>
    <?php
      foreach($rowsSelect as $row){
        echo
          '<tr class="">' .
            "<td>" . $row["usr_token"] . "</td>" .
            "<td>" . date('l jS \of F Y h:i:s A', ($row["tra_date"] / 1000)) . "</td>" .
            "<td>" . $row["tra_lat"] . "</td>" .
            "<td>" . $row["tra_lon"] . "</td>" .
          "</tr>";
      }
    ?>
  </tbody>
</table>
