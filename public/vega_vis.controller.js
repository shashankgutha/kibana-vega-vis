import { ResizeCheckerProvider } from 'ui/resize_checker';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

import { createVegaView } from './vega_view';
// import moment from 'moment';

export function createVegaVisController(Private, $scope) {
  const ResizeChecker = Private(ResizeCheckerProvider);
  const tabify = Private(AggResponseTabifyProvider);

  class VegaVisController {
    link($scope, $el, $attr) {
      const resizeChecker = new ResizeChecker($el);
      $scope.$watchMulti(['=vega.vis.params'], () => {
        const spec = JSON.parse($scope.vega.vis.params.spec);
        this.vegaView = createVegaView($el.get(0), spec);

        resizeChecker.modifySizeWithoutTriggeringResize(() => {
          this.vegaView.resize();
        });
      });

      resizeChecker.on('resize', () => {
        resizeChecker.modifySizeWithoutTriggeringResize(() => {
          this.vegaView.resize();
        });
      });
      $scope.$on('$destroy', () => {
        this.vegaView.destroy();
      });
    }
    //
    // onEsResponse(vis, esResponse) {
    //   if (!this.vegaView) {
    //     throw new Error('esResponse provided before vegaView was initialized');
    //   }
    //
    //   if (!vis || !esResponse) {
    //     this.vegaView.setData([]);
    //     return;
    //   }
    //
    //   const { columns, rows } = tabify(vis, esResponse, {
    //     canSplit: false,
    //     partialRows: true,
    //     minimalColumns: false,
    //     // metricsForAllBuckets: false,
    //     asAggConfigResults: false,
    //   });
    //
    //   const aggTypeCounters = {};
    //   const columnNames = columns.map(col => {
    //     const typeName = col.aggConfig.type.type;
    //     const count = (aggTypeCounters[typeName] || 0) + 1;
    //     aggTypeCounters[typeName] = count;
    //     return `${typeName}${count}`;
    //   });
    //
    //   const vegaTable = rows.map(row => {
    //     return columns.reduce((acc, column, i) => {
    //       let value = row[i];
    //       const field = column.aggConfig.getField();
    //       if (field && field.type === 'date') {
    //         value = moment(value);
    //       }
    //       acc[columnNames[i]] = value;
    //       return acc;
    //     }, {});
    //   });
    //
    //   this.vegaView.setData(vegaTable);
    // }
  }

  return new VegaVisController();
}