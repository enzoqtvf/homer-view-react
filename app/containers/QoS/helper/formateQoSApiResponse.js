/* eslint-disable */

const _labels = [];
const _reports = {};
const _stats = {};
const reportData = [];

function _prepare(label) {
  if (!_reports[label.title]) {
    _labels.push(label);
    _reports[label.title] = [{ values: [], key: label.title }];
  }
}

export default data => {
  try {
    data.forEach((report, i) => {
      const rtcp = JSON.parse(report.raw) || {};
      const label = `${report.srcIp}->${report.dstIp}`;
      const sid = report.sid;

      if (rtcp.sender_information) {
        if (rtcp.sender_information.packets) {
          const ts = {
            title: 'packets',
            color: '#1b62a5',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.sender_information.packets,
            label,
            sid,
          });
        }
        if (rtcp.sender_information.octets) {
          const ts = {
            title: 'octets',
            color: '#9eb9e1',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.sender_information.octets,
            label,
            sid,
          });
        }
      }
      if (rtcp.report_count > 0) {
        if (rtcp.report_blocks[rtcp.report_count - 1].highest_seq_no) {
          const ts = {
            title: 'highest_seq_no',
            color: '#d81b60',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.report_blocks[rtcp.report_count - 1].highest_seq_no,
            label,
            sid,
          });
        }
        if (rtcp.report_blocks[rtcp.report_count - 1].ia_jitter) {
          const ts = {
            title: 'ia_jitter',
            color: '#2196f3',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.report_blocks[rtcp.report_count - 1].ia_jitter,
            label,
            sid,
          });
        }
        if (rtcp.report_blocks[rtcp.report_count - 1].dlsr) {
          const ts = {
            title: 'dlsr',
            color: '#80cbc4',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.report_blocks[rtcp.report_count - 1].dlsr,
            label,
            sid,
          });
        }
        if (rtcp.report_blocks[rtcp.report_count - 1].packets_lost) {
          const ts = {
            title: 'packets_lost',
            color: '#00796b',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.report_blocks[rtcp.report_count - 1].packets_lost,
            label,
            sid,
          });
        }
        if (rtcp.report_blocks[rtcp.report_count - 1].lsr) {
          const ts = {
            title: 'lsr',
            color: '#4caf50',
          };
          _prepare(ts);
          _reports[ts.title][0].values.push({
            x: `${report.timeSeconds}${report.timeUseconds || '000'}`,
            y: rtcp.report_blocks[rtcp.report_count - 1].lsr,
            label,
            sid,
          });
        }
      }
    });
    _aggregateAllStats();
    return { _reports, _labels, _stats, reportData };
  } catch (err) {
    this.$log.error(
      ['CallDetailQos'],
      `process RTCP reports: ${err.message}: ${err.stack}`,
    );
  }
};

function _aggregateAllStats() {
  const banlist = ['packets', 'octets', 'highest_seq_no'];
  _labels.forEach(label => {
    reportData.push({ color: label.color, ..._reports[label.title][0] });
    if (banlist.includes(label.title)) return;
    _stats[label.title] = {
      min: parseInt(
        _reports[label.title][0].values.reduce(
          (min, p) => (p.y < min ? p.y : min),
          _reports[label.title][0].values[0].y,
        ),
      ),
      avg: parseInt(
        _reports[label.title][0].values.reduce(
          (tot, p) => (tot + p.y) / _reports[label.title][0].values.length,
          0,
        ),
      ),
      max: parseInt(
        _reports[label.title][0].values.reduce(
          (max, p) => (p.y > max ? p.y : max),
          _reports[label.title][0].values[0].y,
        ),
      ),
    };
  });
}