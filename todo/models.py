from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import CustomUser


class Task(models.Model):
    priorities = [
        ('LW', _('low')),
        ('MD', _('middle')),
        ('HI', _('high')),
    ]
    statuses = [
        ('TW', _('to work')),
        ('IP', _(' in progress')),
        ('FD', _('finished')),
        ('CL', _('canceled')),
    ]
    title = models.CharField(_('title'), max_length=150)
    description = models.CharField(_('description'), max_length=200)
    expiration_date = models.DateTimeField(_('expiration date'), null=True)
    creation_date = models.DateTimeField(_('creation date'), auto_now_add=True)
    update_date = models.DateTimeField(_('update date'), auto_now=True)
    priority = models.CharField(_('priority'), max_length=2, choices=priorities, default='LW')
    status = models.CharField(_('status'), max_length=2, choices=statuses, default='TW')
    creator = models.ForeignKey(
        to=CustomUser,
        on_delete=models.PROTECT,
        related_name='creator',
        verbose_name=_('creator'),
    )
    responsible = models.ManyToManyField(
        to=CustomUser,
        related_name='responsible',
        verbose_name=_('responsible'),
    )

    def __str__(self):
        return '{}'.format(self.title)
